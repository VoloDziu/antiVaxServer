var express = require('express')

var Question = require('../models/question')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var questionRoutes = express.Router()

// GetAll
questionRoutes.get('/', isRegistered, isAdmin, (req, res) => {
  Question.find({})
    .then(questions => {
      res.json({
        success: true,
        data: {
          questions
        },
        message: null
      })
    })
})

// Get
questionRoutes.get('/:questionId', isRegistered, isAdmin, (req, res) => {
  Question.findOne({id: req.params.questionId})
    .then(question => {
      if (question) {
        res.json({
          success: true,
          data: {
            question
          },
          message: null
        })
      } else {
        res.status(404).json({
          success: false,
          data: {},
          message: 'requested document not found'
        })
      }
    })
})

// Put
questionRoutes.put('/:questionId', isRegistered, isAdmin, (req, res) => {
  Question.findOne({id: req.params.questionId})
    .then(question => {
      if (question) {
        for (let prop in req.body.question) {
          question[prop] = req.body.question[prop]
        }

        question.save((err, section) => {
          if (err) {
            res.status(400).json({
              success: false,
              data: {},
              message: err
            })
          } else {
            res.json({
              success: true,
              data: {
                question
              },
              message: 'document was successfully updated'
            })
          }
        })
      } else {
        res.status(404).json({
          success: false,
          data: {},
          message: 'requested document not found'
        })
      }
    })
})

// Create
questionRoutes.post('/', isRegistered, (req, res) => {
  var question = new Question(Object.assign({}, req.body.question, {
    postedAt: Date.now()
  }))

  question.save()
    .then(question => {
      res.json({
        success: true,
        data: {
          question
        },
        message: 'document was successfully created'
      })
    })
    .catch(err => {
      res.status(400).json({
        success: false,
        data: {},
        message: err
      })
    })
})

// Delete
questionRoutes.delete('/', isRegistered, isAdmin, (req, res) => {
  Question.findOne({id: req.body.id})
    .then(question => {
      if (question) {
        question.remove()

        res.status(200).json({
          success: true,
          data: {},
          message: 'document was successfully deleted'
        })
      } else {
        res.status(404).json({
          success: false,
          data: {},
          message: 'requested document not found'
        })
      }
    })
})

module.exports = questionRoutes
