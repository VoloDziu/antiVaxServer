var express = require('express')

var Section = require('../models/section')
var authenticate = require('../middleware/authenticate')
var authorize = require('../middleware/authorize')

var sectionRoutes = express.Router()

// GetAll
sectionRoutes.get('/', authenticate, authorize, (req, res) => {
  console.log('in')
  Section.find({})
    .then(sections => {
      console.log('found')

      res.json({
        success: true,
        data: {
          sections
        },
        message: null
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        success: false,
        data: {},
        message: 'Oops, something does not seem right :('
      })
    })
})

// Get
sectionRoutes.get('/:sectionId', authenticate, authorize, (req, res) => {
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
sectionRoutes.put('/:sectionId', authenticate, authorize, (req, res) => {
  Section.findOne({id: req.params.sectionId})
    .then(section => {
      if (section) {
        for (let prop in req.body.section) {
          section[prop] = req.body.section[prop]
        }

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
              message: 'documents were successfully updated'
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
sectionRoutes.post('/', authenticate, authorize, (req, res) => {
  var section = new Section(req.body.section)

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
sectionRoutes.delete('/', authenticate, authorize, (req, res) => {
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
