var express = require('express')

var authenticate = require('../middleware/authenticate')
var authorize = require('../middleware/authorize')
var User = require('../models/user')

var userRoutes = express.Router()

// GetAll
userRoutes.get('/', authenticate, authorize, (req, res) => {
  User.find({})
    .then(users => {
      res.json({
        users
      })
    })
    .catch(err => {
      res.status(500).json({
        message: err
      })
    })
})

// Put
userRoutes.put('/:userId', authenticate, authorize, (req, res) => {
  User.findOne({name: req.params.userId})
    .then(user => {
      for (let prop in req.body.user) {
        user[prop] = req.body.user[prop]
      }

      return user.save()
    })
    .then(user => {
      res.json({
        user
      })
    })
    .catch(err => {
      res.status(400).json({
        message: err
      })
    })
})

// Create
userRoutes.post('/', authenticate, authorize, (req, res) => {
  var user = new User(req.body.user)

  user.save()
    .then(user => {
      res.send({
        user
      })
    })
    .catch(err => {
      res.status(422).json({
        error: err
      })
    })
})

// Delete
userRoutes.delete('/', authenticate, authorize, (req, res) => {
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
