var express = require('express')
var ObjectId = require('mongoose').Types.ObjectId

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
        }
      })
    })
})

// Get
questionRoutes.get('/:questionId', isRegistered, isAdmin, (req, res) => {
  Question.findOne({_id: ObjectId(req.params.questionId)})
    .then(question => {
      if (question && !question.isDeleted) {
        res.json({
          success: true,
          data: {
            question
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
questionRoutes.put('/:questionId', isRegistered, isAdmin, (req, res) => {
  Question.findOne({_id: ObjectId(req.params.questionId)})
    .then(question => {
      if (question && !question.isDeleted) {
        for (let prop in req.body.question) {
          question[prop] = req.body.question[prop]
        }

        question.save((err, section) => {
          if (err) {
            res.status(400).json({
              success: false,
              data: err
            })
          } else {
            res.json({
              success: true,
              data: {
                question
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
questionRoutes.post('/', isRegistered, (req, res) => {
  var question = new Question(Object.assign({}, req.body.question, {
    createdAt: Date.now()
  }))

  question.save((err, question) => {
    if (err) {
      res.status(400).json({
        success: false,
        data: err
      })
    } else {
      res.json({
        success: true,
        data: {
          question
        }
      })
    }
  })
})

module.exports = questionRoutes
