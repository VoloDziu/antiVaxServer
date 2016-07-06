var express = require('express')

var Section = require('../models/section')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var sectionRoutes = express.Router()

// GetAll
sectionRoutes.get('/', isRegistered, (req, res) => {
  Section.find({})
    .then(sections => {
      res.json({
        success: true,
        data: {
          sections
        },
        message: null
      })
    })
})

// Get
sectionRoutes.get('/:sectionId', isRegistered, (req, res) => {
  Section.findOne({id: req.params.sectionId})
    .then(section => {
      if (section) {
        res.json({
          success: true,
          data: {
            section
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
sectionRoutes.put('/:sectionId', isRegistered, isAdmin, (req, res) => {
  Section.findOne({id: req.params.sectionId})
    .then(section => {
      if (section) {
        for (let prop in req.body.section) {
          section[prop] = req.body.section[prop]
        }

        section.lastModifiedBy = req.user.name
        section.lastModifiedAt = Date.now()

        section.save((err, section) => {
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
                section
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
sectionRoutes.post('/', isRegistered, isAdmin, (req, res) => {
  var section = new Section(Object.assign({}, req.body.section, {
    lastModifiedBy: req.user.name,
    lastModifiedAt: Date.now()
  }))

  section.save()
    .then(section => {
      res.json({
        success: true,
        data: {
          section
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
sectionRoutes.delete('/', isRegistered, isAdmin, (req, res) => {
  Section.findOne({id: req.body.id})
    .then(section => {
      if (section) {
        section.remove()

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

module.exports = sectionRoutes
