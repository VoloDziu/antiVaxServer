var express = require('express')
var ObjectId = require('mongoose').Types.ObjectId

var Article = require('../models/article')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var articleRoutes = express.Router()

// GetAll
articleRoutes.get('/', isRegistered, isAdmin, (req, res) => {
  Article.find({})
    .sort('-createdAt')
    .then(articles => {
      res.json({
        success: true,
        data: {
          articles
        }
      })
    })
})

// Get
articleRoutes.get('/:articleId', isRegistered, isAdmin, (req, res) => {
  Article.findOne({_id: ObjectId(req.params.articleId)})
    .then(article => {
      if (article) {
        res.json({
          success: true,
          data: {
            article
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
articleRoutes.put('/:articleId', isRegistered, isAdmin, (req, res) => {
  Article.findOne({_id: ObjectId(req.params.articleId)})
    .then(article => {
      if (article) {
        for (let prop in req.body.article) {
          article[prop] = req.body.article[prop]
        }

        article.lastModifiedBy = req.user.name
        article.lastModifiedAt = Date.now()

        article.save((err, section) => {
          if (err) {
            res.status(400).json({
              success: false,
              data: err
            })
          } else {
            res.json({
              success: true,
              data: {
                article
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
articleRoutes.post('/', isRegistered, isAdmin, (req, res) => {
  var article = new Article(Object.assign({}, req.body.article, {
    lastModifiedBy: req.user.name,
    lastModifiedAt: Date.now(),
    createdAt: Date.now()
  }))

  article.save((err, article) => {
    if (err) {
      res.status(400).json({
        success: false,
        data: err
      })
    } else {
      res.json({
        success: true,
        data: {
          article
        }
      })
    }
  })
})

// Delete
articleRoutes.delete('/:articleId', isRegistered, isAdmin, (req, res) => {
  Article.findOne({_id: ObjectId(req.params.articleId)})
    .then(article => {
      if (article) {
        article.remove()

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

module.exports = articleRoutes
