var express = require('express')

var Faq = require('../models/faq')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var faqRoutes = express.Router()

// GetAll
faqRoutes.get('/', isRegistered, isAdmin, (req, res) => {
  Faq.find({})
    .then(faqs => {
      res.json({
        success: true,
        data: {
          faqs
        },
        message: null
      })
    })
})

// Get
faqRoutes.get('/:faqId', isRegistered, isAdmin, (req, res) => {
  Faq.findOne({id: req.params.faqId})
    .then(faq => {
      if (faq) {
        res.json({
          success: true,
          data: {
            faq
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
faqRoutes.put('/:faqId', isRegistered, isAdmin, (req, res) => {
  Faq.findOne({id: req.params.faqId})
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
              data: {},
              message: err
            })
          } else {
            res.json({
              success: true,
              data: {
                faq
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
faqRoutes.post('/', isRegistered, isAdmin, (req, res) => {
  var faq = new Faq(Object.assign({}, req.body.faq, {
    lastModifiedBy: req.user.name,
    lastModifiedAt: Date.now()
  }))

  faq.save()
    .then(blogpost => {
      res.json({
        success: true,
        data: {
          faq
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
faqRoutes.delete('/', isRegistered, isAdmin, (req, res) => {
  Faq.findOne({id: req.body.id})
    .then(faq => {
      if (faq) {
        faq.remove()

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

module.exports = faqRoutes
