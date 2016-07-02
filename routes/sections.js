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
        sections
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
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
          section
        })
      } else {
        res.status(404).json({
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
              message: err
            })
          } else {
            res.json({
              message: 'documents were successfully updated',
              section
            })
          }
        })
      } else {
        res.status(404).json({
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
        message: 'document was successfully created',
        section
      })
    })
    .catch(err => {
      res.status(400).json({
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
          message: 'document was successfully deleted'
        })
      } else {
        res.status(404).json({
          message: 'requested document not found'
        })
      }
    })
})

module.exports = sectionRoutes
