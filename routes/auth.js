var express = require('express')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

var User = require('../models/user')

var authRoutes = express.Router()

const canAccess = (user, app) => {
  return user.apps.indexOf(app)) !== -1
}

authRoutes.post('/authenticate', (req, res) => {
  const app = req.body.app  

  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        res.status(422).json({ success: false, message: 'Authentication failed: no such user' })
      } else {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          if (canAccess(user, app)) {
          }

          var token = jwt.sign(user, process.env.ANTIVAX_SERVER_SECRET, {
            expiresIn: '24h'
          })

          res.json({
            success: true,
            user: user,
            token: token
          })
        } else {
          res.status(422).json({ success: false, message: 'Authentication failed: invalid password' })
        }
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: err
      })
    })
})

authRoutes.post('/verify', (req, res) => {
  try {
    const user = jwt.verify(req.body.token)
    const app = req.body.app

    if (caAccess(user, app)) {
      res.json({
        success: true,
        user
      })
    } else {
      res.status(401).json({
        success: false,
        message: `Access denied for ${user.name}` 
      })
    }
  } catch {
    req.status(401).json({
      success: false,
      message: 'token has expired'
    })
  }
})

module.exports = authRoutes
