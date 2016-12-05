var express = require('express')
var ObjectId = require('mongoose').Types.ObjectId

var Section = require('../models/section')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var sectionRoutes = express.Router()

// Get All
sectionRoutes.get('/', isRegistered, (req, res) => {
  Section.find({})
    .sort('-createdAt')
    .populate('items.article')
    .then(sections => {
      res.json({
        success: true,
        data: {
          sections
        }
      })
    })
})

// Get
sectionRoutes.get('/:sectionId', isRegistered, (req, res) => {
  Section.findOne({_id: ObjectId(req.params.sectionId)})
    .populate('items.article')
    .then(section => {
      if (section) {
        res.json({
          success: true,
          data: {
            section
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
sectionRoutes.put('/:sectionId', isRegistered, isAdmin, (req, res) => {
  Section.findOne({_id: ObjectId(req.params.sectionId)})
    .then(section => {
      if (section) {
        Object.assign(section, req.body.section, {
          lastModifiedBy: req.user.name,
          lastModifiedAt: Date.now()
        })

        section.save((err, section) => {
          if (err) {
            res.status(400).json({
              success: false,
              data: err
            })
          } else {
            res.json({
              success: true,
              data: {
                section
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
sectionRoutes.post('/', isRegistered, isAdmin, (req, res) => {
  var section = new Section(Object.assign({}, req.body.section, {
    lastModifiedBy: req.user.name,
    lastModifiedAt: Date.now(),
    createdAt: Date.now()
  }))

  section.save((err, section) => {
    if (err) {
      res.status(400).json({
        success: false,
        data: err
      })
    } else {
      res.json({
        success: true,
        data: {
          section
        }
      })
    }
  })
})

// Delete
sectionRoutes.delete('/:sectionId', isRegistered, isAdmin, (req, res) => {
  Section.findOne({_id: ObjectId(req.params.sectionId)})
    .then(section => {
      if (section) {
        section.remove()

        res.json({
          success: true,
          data: {}
        })
      } else {
        res.status(404).json({
          success: false,
          data: {}
        })
      }
    })
})

module.exports = sectionRoutes
