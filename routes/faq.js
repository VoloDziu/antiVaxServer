var express = require('express')
var ObjectId = require('mongoose').Types.ObjectId

var Faq = require('../models/faq')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var faqRoutes = express.Router()

// GetAll
faqRoutes.get('/', isRegistered, isAdmin, (req, res) => {
  Faq.find({})
    .sort('-createdAt')
    .then(faqs => {
      res.json({
        success: true,
        data: {
          faqs
        }
      })
    })
})

// Get
faqRoutes.get('/:faqId', isRegistered, isAdmin, (req, res) => {
  Faq.findOne({_id: ObjectId(req.params.faqId)})
    .then(faq => {
      if (faq && !faq.isDeleted) {
        res.json({
          success: true,
          data: {
            faq
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
faqRoutes.put('/:faqId', isRegistered, isAdmin, (req, res) => {
  Faq.findOne({_id: ObjectId(req.params.faqId)})
    .then(faq => {
      if (faq) {
        for (let prop in req.body.faq) {
          faq[prop] = req.body.faq[prop]
        }

        faq.lastModifiedBy = req.user.name
        faq.lastModifiedAt = Date.now()

        faq.save((err, section) => {
          if (err) {
            res.status(400).json({
              success: false,
              data: err
            })
          } else {
            res.json({
              success: true,
              data: {
                faq
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
faqRoutes.post('/', isRegistered, isAdmin, (req, res) => {
  var faq = new Faq(Object.assign({}, req.body.faq, {
    lastModifiedBy: req.user.name,
    lastModifiedAt: Date.now(),
    createdAt: Date.now()
  }))

  faq.save((err, faq) => {
    if (err) {
      res.status(400).json({
        success: false,
        data: err
      })
    } else {
      res.json({
        success: true,
        data: {
          faq
        }
      })
    }
  })
})

module.exports = faqRoutes
