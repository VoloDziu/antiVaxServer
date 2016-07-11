var express = require('express')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var User = require('../models/user')

var authRoutes = express.Router()

authRoutes.post('/authenticate', (req, res) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (user && !user.isDeleted) {
        if (user.isEnabled) {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            var payload = {
              id: user.id,
              name: user.name,
              admin: user.admin,
              isEnabled: user.isEnabled,
              isDeleted: user.isDeleted
            }

            var token = jwt.sign(payload, process.env.ANTIVAX_SERVER_SECRET, {
              expiresIn: '72h'
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
              data: {
                error: 'Wrong password'
              }
            })
          }
        } else {
          res.status(422).json({
            success: false,
            data: {
              error: 'Your account has been suspended'
            }
          })
        }
      } else {
        res.status(422).json({
          success: false,
          data: {
            error: 'User does not exist'
          }
        })
      }
    })
})

authRoutes.post('/admin/authenticate', (req, res) => {
  User.findOne({email: req.body.email})
  .then(user => {
    if (user && !user.isDeleted) {
      if (user.isEnabled) {
        if (user.admin) {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            var payload = {
              id: user.id,
              name: user.name,
              admin: user.admin
            }

            var token = jwt.sign(payload, process.env.ANTIVAX_SERVER_SECRET, {
              expiresIn: '72h'
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
              data: {
                error: 'Wrong password'
              }
            })
          }
        } else {
          res.status(401).json({
            success: false,
            data: {
              error: 'Your account does not grant admin access'
            }
          })
        }
      } else {
        res.status(422).json({
          success: false,
          data: {
            error: 'Your account has been suspended'
          }
        })
      }
    } else {
      res.status(422).json({
        success: false,
        data: {
          error: 'User does not exist'
        }
      })
    }
  })
})

module.exports = authRoutes
