var express = require('express')
var ObjectId = require('mongoose').Types.ObjectId
var striptags = require('striptags')

var Article = require('../models/article')
var Section = require('../models/section')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var articleRoutes = express.Router()

// GetAll
articleRoutes.get('/', isRegistered, (req, res) => {
  Article.find({})
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
        if (!article.isPublished && req.body.article.isPublished) {
          req.body.article.publishedAt = Date.now()
          req.body.article.publishedBy = req.user.name
        }

        Object.assign(article, req.body.article, {
          lastModifiedBy: req.user.name,
          lastModifiedAt: Date.now()
        })

        article.content = striptags(article.content, '<a><h1><h2><b><i><p><ul><ol><li>')

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
  Section.findOne({_id: ObjectId(req.body.article.parent)})
    .then(parent => {
      if (parent) {
        var article = new Article(Object.assign({}, req.body.article, {
          lastModifiedBy: req.user.name,
          lastModifiedAt: Date.now(),
          createdBy: req.user.name,
          createdAt: Date.now()
        }))

        article.content = striptags(article.content, '<a><h1><h2><b><i><p><ul><ol><li>')

        if (!article.url) {
          article.url = Math.random().toString(36).substr(2, 10)
        }

        if (req.body.article.isPublished) {
          article.publishedAt = Date.now()
          article.publishedBy = req.user.name
        }

        article.save((err, article) => {
          if (err) {
            res.status(400).json({
              success: false,
              data: err
            })
          } else {
            parent.articles = [
              article._id,
              ...parent.articles
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
                    article,
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

// Delete
articleRoutes.delete('/:articleId', isRegistered, isAdmin, (req, res) => {
  Article.findOne({_id: ObjectId(req.params.articleId)})
    .then(article => {
      Section.findOne({_id: ObjectId(article.parent)})
        .then(parent => {
          if (parent && article) {
            let articleIndex = parent.articles.indexOf(article._id)
            parent.articles = [
              ...parent.articles.slice(0, articleIndex),
              ...parent.articles.slice(articleIndex + 1)
            ]

            parent.save((err, parent) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  data: err
                })
              } else {
                article.remove()

                res.json({
                  success: true,
                  data: {
                    parent
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

// Create comment
articleRoutes.post('/:articleId/comments/', isRegistered, (req, res) => {
  Article.findOne({_id: ObjectId(req.params.articleId)})
    .then(article => {
      if (article) {
        var comment = article.comments.create(Object.assign({}, req.body.comment, {
          createdBy: req.user.name,
          createdAt: Date.now()
        }))

        comment.content = striptags(comment.content, '<a><h1><h2><b><i><p><ul><ol><li>')

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
            createdBy: req.user.name,
            createdAt: Date.now()
          }))

          reply.content = striptags(reply.content, '<a><h1><h2><b><i><p><ul><ol><li>')

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
