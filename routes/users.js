var express = require('express')
var bcrypt = require('bcrypt')
var ObjectId = require('mongoose').Types.ObjectId

var User = require('../models/user')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var userRoutes = express.Router()
var saltRounds = 10

// GetAll
userRoutes.get('/', isRegistered, isAdmin, (req, res) => {
  User.find({})
    .sort('-createdAt')
    .then(users => {
      res.json({
        success: true,
        data: {
          users
        }
      })
    })
})

// Get
userRoutes.get('/:userId', isRegistered, isAdmin, (req, res) => {
  User.findOne({_id: ObjectId(req.params.userId)})
    .then(user => {
      if (user && !user.isDeleted) {
        res.json({
          success: true,
          data: {
            user
          }
        })
      } else {
        res.status(404).json({
          success: false,
          data: {}
        })
      }
    })
})

// Put
userRoutes.put('/:userId', isRegistered, isAdmin, (req, res) => {
  User.findOne({_id: ObjectId(req.params.userId)})
    .then(user => {
      if (user) {
        for (let prop in req.body.user) {
          if (prop !== 'password') {
            user[prop] = req.body.user[prop]
          } else {
            user.password = bcrypt.hashSync(req.body.user.password, saltRounds)
          }
        }

        user.save((err, section) => {
          if (err) {
            res.status(400).json({
              success: false,
              data: err
            })
          } else {
            res.json({
              success: true,
              data: {
                user
              }
            })
          }
        })
      } else {
        res.status(404).json({
          success: false,
          data: {}
        })
      }
    })
})

// Create
userRoutes.post('/', isRegistered, isAdmin, (req, res) => {
  var user = new User(Object.assign({}, req.body.user, {
    password: bcrypt.hashSync(req.body.user.password, saltRounds),
    createdAt: Date.now()
  }))

  user.save((err, user) => {
    if (err) {
      res.status(400).json({
        success: false,
        data: err
      })
    } else {
      res.json({
        success: true,
        data: {
          user
        }
      })
    }
  })
})

// Delete
userRoutes.delete('/:userId', isRegistered, isAdmin, (req, res) => {
  User.findOne({_id: ObjectId(req.params.userId)})
    .then(user => {
      if (user) {
        user.remove()

        res.json({
          success: true,
          data: {}
        })
      } else {
        res.status(404).json({
          success: false,
          data: {}
        })
      }
    })
})

module.exports = userRoutes
