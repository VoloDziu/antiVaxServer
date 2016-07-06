var express = require('express')

var Blogpost = require('../models/blogpost')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var blogpostRoutes = express.Router()

// GetAll
blogpostRoutes.get('/', isRegistered, (req, res) => {
  Blogpost.find({})
    .then(blogposts => {
      res.json({
        success: true,
        data: {
          blogposts
        },
        message: null
      })
    })
})

// Get
blogpostRoutes.get('/:blogpostId', isRegistered, (req, res) => {
  Blogpost.findOne({id: req.params.blogpostId})
    .then(blogpost => {
      if (blogpost) {
        res.json({
          success: true,
          data: {
            blogpost
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
blogpostRoutes.put('/:blogpostId', isRegistered, isAdmin, (req, res) => {
  Blogpost.findOne({id: req.params.blogpostId})
    .then(blogpost => {
      if (blogpost) {
        for (let prop in req.body.blogpost) {
          blogpost[prop] = req.body.blogpost[prop]
        }

        blogpost.lastModifiedBy = req.user.name
        blogpost.lastModifiedAt = Date.now()

        blogpost.save((err, section) => {
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
                blogpost
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
blogpostRoutes.post('/', isRegistered, isAdmin, (req, res) => {
  var blogpost = new Blogpost(Object.assign({}, req.body.blogpost, {
    lastModifiedBy: req.user.name,
    lastModifiedAt: Date.now()
  }))

  blogpost.save()
    .then(blogpost => {
      res.json({
        success: true,
        data: {
          blogpost
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
blogpostRoutes.delete('/', isRegistered, isAdmin, (req, res) => {
  Blogpost.findOne({id: req.body.id})
    .then(blogpost => {
      if (blogpost) {
        blogpost.remove()

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

module.exports = blogpostRoutes
