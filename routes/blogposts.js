var express = require('express')
var ObjectId = require('mongoose').Types.ObjectId

var Blogpost = require('../models/blogpost')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var blogpostRoutes = express.Router()

// GetAll
blogpostRoutes.get('/', isRegistered, (req, res) => {
  Blogpost.find({})
    .sort('-createdAt')
    .then(blogposts => {
      res.json({
        success: true,
        data: {
          blogposts
        }
      })
    })
})

// Get
blogpostRoutes.get('/:blogpostId', isRegistered, (req, res) => {
  Blogpost.findOne({_id: ObjectId(req.params.blogpostId)})
    .then(blogpost => {
      if (blogpost && !blogpost.isDeleted) {
        res.json({
          success: true,
          data: {
            blogpost
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
blogpostRoutes.put('/:blogpostId', isRegistered, isAdmin, (req, res) => {
  Blogpost.findOne({_id: ObjectId(req.params.blogpostId)})
    .then(blogpost => {
      if (blogpost) {
        for (let prop in req.body.blogpost) {
          // TODO: exclude comments
          blogpost[prop] = req.body.blogpost[prop]
        }

        blogpost.lastModifiedBy = req.user.name
        blogpost.lastModifiedAt = Date.now()

        blogpost.save((err, section) => {
          if (err) {
            res.status(400).json({
              success: false,
              data: err
            })
          } else {
            res.json({
              success: true,
              data: {
                blogpost
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
blogpostRoutes.post('/', isRegistered, isAdmin, (req, res) => {
  var blogpost = new Blogpost(Object.assign({}, req.body.blogpost, {
    lastModifiedBy: req.user.name,
    lastModifiedAt: Date.now(),
    createdAt: Date.now()
  }))

  blogpost.save((err, blogpost) => {
    if (err) {
      res.status(400).json({
        success: false,
        data: err
      })
    } else {
      res.json({
        success: true,
        data: {
          blogpost
        }
      })
    }
  })
})

// TODO: blogpost comments routes:
// POST /comments/
// PUT /comments/:id

module.exports = blogpostRoutes
