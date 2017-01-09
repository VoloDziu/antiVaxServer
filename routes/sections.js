var express = require('express')
var ObjectId = require('mongoose').Types.ObjectId

var Section = require('../models/section')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var sectionRoutes = express.Router()

// Get
sectionRoutes.get('/', isRegistered, (req, res) => {
  Section.find()
    .then(items => {
      res.json({
        success: true,
        data: {
          items
        }
      })
    })
})

// Create
sectionRoutes.post('/', isRegistered, isAdmin, (req, res) => {
  Section.findOne({_id: req.body.section.parent})
    .then(parent => {
      if (parent) {
        let newSection = new Section(Object.assign({}, req.body.section, {
          createdAt: Date.now(),
          createdBy: req.user.name,
          lastModifiedAt: Date.now(),
          lastModifiedBy: req.user.name
        }))

        if (!newSection.url) {
          newSection.url = Math.random().toString(36).substr(2, 10)
        }

        newSection.save((err, section) => {
          if (err) {
            res.status(400).json({
              success: false,
              data: err
            })
          } else {
            parent.children = [
              newSection._id,
              ...parent.children
            ]

            parent.save((err, parent) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  data: err
                })
              } else {
                res.json({
                  success: true,
                  data: {
                    section,
                    parent
                  }
                })
              }
            })
          }
        })
      } else {
        res.status(400).json({
          success: false,
          data: {}
        })
      }
    })
})

// Update
sectionRoutes.put('/:sectionId', isRegistered, isAdmin, (req, res) => {
  Section.findOne({_id: ObjectId(req.params.sectionId)})
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
          sucess: false,
          data: {}
        })
      }
    })
})

// Delete
sectionRoutes.delete('/:sectionId', isRegistered, isAdmin, (req, res) => {
  Section.findOne({_id: ObjectId(req.params.sectionId)})
    .then(section => {
      Section.findOne({_id: ObjectId(section.parent)})
        .then(parent => {
          if (section && parent) {
            let childIndex = parent.children.indexOf(section._id)

            parent.children = [
              ...parent.children.slice(0, childIndex),
              ...parent.children.slice(childIndex + 1)
            ]

            parent.save((err, parent) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  data: err
                })
              } else {
                Section.remove({_id: {$in: [...section.children, section._id]}}, (err, data) => {
                  if (err) {
                    res.status(400).json({
                      success: false,
                      data: err
                    })
                  } else {
                    res.json({
                      success: true,
                      data: {
                        parent
                      }
                    })
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
})

module.exports = sectionRoutes
