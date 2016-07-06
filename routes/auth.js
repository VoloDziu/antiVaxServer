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
          var payload = {
            id: user.id,
            name: user.name,
            admin: user.admin
          }

          var token = jwt.sign(payload, process.env.ANTIVAX_SERVER_SECRET, {
            expiresIn: '24h'
          })

          user.lastLoggedInAt = Date.now()
          user.save()

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

authRoutes.post('/admin/authenticate', (req, res) => {
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
          if (user.admin) {
            var payload = {
              id: user.id,
              name: user.name,
              admin: user.admin
            }

            var token = jwt.sign(payload, process.env.ANTIVAX_SERVER_SECRET, {
              expiresIn: '24h'
            })

            user.lastLoggedInAt = Date.now()
            user.save()

            res.json({
              success: true,
              data: {
                user: user,
                token: token
              },
              message: null
            })
          } else {
            res.status(401).json({
              success: false,
              data: {},
              message: 'Authorization failed: user is not admin'
            })
          }
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
