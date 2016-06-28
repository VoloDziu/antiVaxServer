var express = require('express')

var Section = require('../models/section')
var requiresAuth = require('../middleware/requiresAuth')

var sectionRoutes = express.Router()

// GetAll
sectionRoutes.get('/', requiresAuth, (req, res) => {
  Section.find({})
    .then(sections => {
      res.json({
        success: true,
        sections
      })
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: err
      })
    })
})

// Get
sectionRoutes.get('/:sectionId', requiresAuth, (req, res) => {
  Section.findOne({id: req.params.sectionId})
    .then(section => {
      if (section) {
        res.json({
          success: true,
          section
        })
      } else {
        res.status(404).json({
          success: false
        })
      }
    })
    .catch(err => {
      res.status(422).json({
        success: false,
        error: err
      })
    })
})

// Put
sectionRoutes.put('/:sectionId', requiresAuth, (req, res) => {
  Section.findOne({id: req.params.sectionId})
    .then(section => {
      for (let prop in req.body.section) {
        section[prop] = req.body.section[prop]
      }

      if (section.save()) {
        res.json({
          success: true,
          section
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
sectionRoutes.post('/', requiresAuth, (req, res) => {
  var section = new Section(req.body.section)

  section.save()
    .then(section => {
      res.send({
        success: true,
        section
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
sectionRoutes.delete('/', requiresAuth, (req, res) => {
  Section.findOne({id: req.body.id})
    .then(section => {
      if (section) {
        section.remove()

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

module.exports = sectionRoutes
