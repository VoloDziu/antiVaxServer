var express = require('express')
var ObjectId = require('mongoose').Types.ObjectId

var Section = require('../models/section')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var sectionRoutes = express.Router()

// GetAll
sectionRoutes.get('/', isRegistered, (req, res) => {
  Section.find({})
    .sort('-createdAt')
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
    .then(section => {
      if (section && !section.isDeleted) {
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
      if (section && !section.isDeleted) {
        for (let prop in req.body.section) {
          if (prop !== 'pages') {
            section[prop] = req.body.section[prop]
          }
        }

        section.lastModifiedBy = req.user.name
        section.lastModifiedAt = Date.now()

        section.save((err, section) => {
          if (err) {
            res.status(400).json({
              success: false,
              data: {}
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

// Create page
sectionRoutes.post('/:sectionId/pages', isRegistered, isAdmin, (req, res) => {
  Section.find({_id: ObjectId(req.params.sectionId)})
    .then(section => {
      if (section && !section.isDeleted) {
        var page = section.pages.create(Object.assign({}, req.body.page, {
          lastModifiedBy: req.user.name,
          lastModifiedAt: Date.now(),
          createdAt: Date.now()
        }))

        var nPages = section.pages.length

        section.pages.push(page)

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
                page: section.pages[nPages]
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

// Put page
sectionRoutes.put('/:sectionId/pages/:pageId', isRegistered, isAdmin, (req, res) => {
  Section.find({_id: ObjectId(req.params.sectionId)})
    .then(section => {
      if (section && !section.isDeleted) {
        var page = section.pages.id(ObjectId(req.params.pageId))

        if (page && !page.isDeleted) {
          for (let prop in req.body.page) {
            page[prop] = req.body.page[prop]
          }

          page.lastModifiedBy = req.user.name
          page.lastModifiedAt = Date.now()

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
                  page: section.pages.id(ObjectId(req.params.pageId))
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
      } else {
        res.status(404).json({
          success: false,
          data: {}
        })
      }
    })
})

module.exports = sectionRoutes
