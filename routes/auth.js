var express = require('express')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var saltRounts = 10

var User = require('../models/user')

var authRoutes = express.Router()

authRoutes.get('/setup', function (req, res) {
  User.findOne({
    name: process.env.AUTH_SERVER_SUSER_NAME
  }, (err, user) => {
    if (err) {
      res.json({
        success: false,
        error: err
      })
    }

    if (user) {
      res.json({
        success: false,
        message: 'Server already set up'
      })
    } else {
      var sUser = new User({
        name: process.env.AUTH_SERVER_SUSER_NAME,
        password: bcrypt.hashSync(process.env.AUTH_SERVER_SUSER_PASS, saltRounts),
        admin: true
      })

      sUser.save((err) => {
        if (err) {
          throw err
        }

        res.json({
          success: true
        })
      })
    }
  })
})

authRoutes.post('/authenticate', function (req, res) {
  User.findOne({
    name: req.body.name
  }, function (err, user) {
    if (err) {
      throw err
    }

    if (!user) {
      res.json({ success: false, message: 'Authentication failed (no user)' })
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        var token = jwt.sign(user, process.env.AUTH_SERVER_SECRET, {
          expiresIn: '24h'
        })

        res.json({
          success: true,
          user: user,
          token: token
        })
      } else {
        res.json({ success: false, message: 'Authentication failed (pass mismatch)' })
      }
    }
  })
})

module.exports = authRoutes
