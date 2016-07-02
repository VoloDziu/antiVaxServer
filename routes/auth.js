var express = require('express')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var User = require('../models/user')

var authRoutes = express.Router()

authRoutes.post('/authenticate', (req, res) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        res.status(422).json({
          success: false,
          data: {},
          message: 'Authentication failed: no such user'
        })
      } else {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          var token = jwt.sign(user, process.env.ANTIVAX_SERVER_SECRET, {
            expiresIn: '24h'
          })

          res.json({
            success: true,
            data: {
              user: user,
              token: token
            },
            message: null
          })
        } else {
          res.status(400).json({
            success: false,
            data: {},
            message: 'Authentication failed: invalid password'
          })
        }
      }
    })
})

module.exports = authRoutes
