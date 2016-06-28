var express = require('express')

var requiresAuth = require('../middleware/requiresAuth')
var User = require('../models/user')

var userRoutes = express.Router()

// GetAll
userRoutes.get('/', requiresAuth, (req, res) => {
  User.find({})
    .then(users => {
      res.json({
        success: true,
        users
      })
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: err
      })
    })
})

// Put
userRoutes.put('/:userId', requiresAuth, (req, res) => {
  User.findOne({name: req.params.userId})
    .then(user => {
      for (let prop in req.body.user) {
        user[prop] = req.body.user[prop]
      }

      if (user.save()) {
        res.json({
          success: true,
          user
        })
      } else {
        res.status(422).json({
          success: false
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: err
      })
    })
})

// Create
userRoutes.post('/', requiresAuth, (req, res) => {
  var user = new User(req.body.user)

  user.save()
    .then(user => {
      res.send({
        success: true,
        user
      })
    })
    .catch(err => {
      res.status(422).json({
        success: false,
        error: err
      })
    })
})

// Delete
userRoutes.delete('/', requiresAuth, (req, res) => {
  User.findOne({id: req.body.id})
    .then(user => {
      if (user) {
        user.remove()

        res.json({
          success: true
        })
      } else {
        res.status(404).json({
          success: false
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: err
      })
    })
})

module.exports = userRoutes
