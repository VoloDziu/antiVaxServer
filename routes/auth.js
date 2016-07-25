var express = require('express')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var User = require('../models/user')

var authRoutes = express.Router()

authRoutes.post('/authenticate-credentials', (req, res) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (user && user.isEnabled) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          var payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            lastLoggedInAt: user.lastLoggedInAt
          }

          var token = jwt.sign(payload, process.env.ANTIVAX_SERVER_SECRET, {
            expiresIn: '72h'
          })

          user.lastLoggedInAt = Date.now()
          user.save()

          res.json({
            success: true,
            data: {
              user: payload,
              token: token
            }
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
            error: 'User does not exist or has been suspended'
          }
        })
      }
    })
})

authRoutes.post('/authenticate-token', (req, res) => {
  try {
    const decodedUser = jwt.verify(req.body.token, process.env.ANTIVAX_SERVER_SECRET)

    User.findOne({email: decodedUser.email})
      .then(user => {
        if (user && user.isEnabled) {
          var payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            lastLoggedInAt: user.lastLoggedInAt
          }

          var token = jwt.sign(payload, process.env.ANTIVAX_SERVER_SECRET, {
            expiresIn: '72h'
          })

          user.lastLoggedInAt = Date.now()
          user.save()

          res.json({
            success: true,
            data: {
              user: payload,
              token: token
            }
          })
        } else {
          return res.status(422).json({
            success: false,
            data: {
              error: 'User does not exist or has been suspended'
            }
          })
        }
      })
  } catch (err) {
    return res.status(401).json({
      success: false,
      data: {
        error: 'Token invalid or expired'
      }
    })
  }
})

authRoutes.post('/admin/authenticate-credentials', (req, res) => {
  User.findOne({email: req.body.email})
  .then(user => {
    if (user && user.isEnabled) {
      if (user.admin) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          var payload = {
            name: user.name,
            email: user.email,
            admin: user.admin,
            lastLoggedInAt: user.lastLoggedInAt
          }

          var token = jwt.sign(payload, process.env.ANTIVAX_SERVER_SECRET, {
            expiresIn: '72h'
          })

          user.lastLoggedInAt = Date.now()
          user.save()

          res.json({
            success: true,
            data: {
              user: payload,
              token: token
            }
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
          error: 'User does not exist or has been suspended'
        }
      })
    }
  })
})

authRoutes.post('/admin/authenticate-token', (req, res) => {
  try {
    const decodedUser = jwt.verify(req.body.token, process.env.ANTIVAX_SERVER_SECRET)

    User.findOne({email: decodedUser.email})
      .then(user => {
        if (user && user.isEnabled) {
          if (user.admin) {
            var payload = {
              name: user.name,
              email: user.email,
              admin: user.admin,
              lastLoggedInAt: user.lastLoggedInAt
            }

            var token = jwt.sign(payload, process.env.ANTIVAX_SERVER_SECRET, {
              expiresIn: '72h'
            })

            user.lastLoggedInAt = Date.now()
            user.save()

            res.json({
              success: true,
              data: {
                user: payload,
                token: token
              }
            })
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
              error: 'User does not exist or has been suspended'
            }
          })
        }
      })
  } catch (err) {
    return res.status(401).json({
      success: false,
      data: {
        error: 'Token invalid or expired'
      }
    })
  }
})

module.exports = authRoutes
