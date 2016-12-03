var express = require('express')
var ObjectId = require('mongoose').Types.ObjectId

var Article = require('../models/article')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var articleRoutes = express.Router()

// GetAll
articleRoutes.get('/', isRegistered, (req, res) => {
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
articleRoutes.get('/:articleId', isRegistered, (req, res) => {
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
          if (prop === 'comments') {
            article.comments = req.body.article.comments.filter(c => !c.isDeleted).map(c => {
              return Object.assign({}, c, {
                replies: c.replies.filter(r => !r.isDeleted)
              })
            })
          } else {
            article[prop] = req.body.article[prop]
          }
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
  Article.count({'type.id': req.body.article.type.id}, (err, nArticles) => {
    if (err) {
      res.status(400).json({
        success: false,
        data: err
      })
    }

    var article = new Article(Object.assign({}, req.body.article, {
      lastModifiedBy: req.user.name,
      lastModifiedAt: Date.now(),
      createdAt: Date.now(),
      order: nArticles
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

// Create comment
articleRoutes.post('/:articleId/comments/', isRegistered, (req, res) => {
  Article.findOne({_id: ObjectId(req.params.articleId)})
    .then(article => {
      if (article) {
        var comment = article.comments.create(Object.assign({}, req.body.comment, {
          lastModifiedBy: req.user.name,
          lastModifiedAt: Date.now(),
          createdAt: Date.now()
        }))

        var nComments = article.comments.length

        article.comments.push(comment)

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
                comment: article.comments[nComments]
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

// Create reply
articleRoutes.post('/:articleId/comments/:commentId/replies/', isRegistered, (req, res) => {
  Article.findOne({_id: ObjectId(req.params.articleId)})
    .then(article => {
      if (article) {
        var comment = article.comments.id(ObjectId(req.params.commentId))

        if (comment) {
          const reply = comment.replies.create(Object.assign({}, req.body.reply, {
            lastModifiedBy: req.user.name,
            lastModifiedAt: Date.now(),
            createdAt: Date.now()
          }))

          var nReplies = comment.replies.length

          comment.replies.push(reply)

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
                  reply: article.comments.filter(c => c._id === comment._id)[0].replies[nReplies]
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

module.exports = articleRoutes
