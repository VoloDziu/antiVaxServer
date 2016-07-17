var express = require('express')
var algoliasearch = require('algoliasearch')
var client = algoliasearch(process.env.ANTIVAX_ALGOLIA_APPID, process.env.ANTIVAX_ALGOLIA_APIKEY)

var SearchIndex = require('../models/searchIndex')
var Article = require('../models/article')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var searchIndexRoutes = express.Router()

searchIndexRoutes.get('/', isRegistered, isAdmin, (req, res) => {
  SearchIndex.findOne()
    .then(searchIndex => {
      if (searchIndex) {
        res.json({
          success: true,
          data: {
            searchIndex
          }
        })
      } else {
        var newSearchIndex = new SearchIndex({
          lastUpdatedBy: req.user.name,
          lastUpdatedOn: Date.now()
        })

        newSearchIndex.save((err, searchIndex) => {
          if (err) {
            res.status(400).json({
              success: false,
              data: err
            })
          } else {
            res.json({
              success: true,
              data: {
                searchIndex
              }
            })
          }
        })
      }
    })
})

searchIndexRoutes.put('/', isRegistered, isAdmin, (req, res) => {
  SearchIndex.findOne()
    .then(searchIndex => {
      if (searchIndex) {
        Article.find({})
          .then(articles => {
            var categoryParentMap = {}
            for (let categoryParent of articles.filter(a => a.category)) {
              categoryParentMap[categoryParent.type.id] = categoryParentMap.url
            }

            var isInCategory = (article) => {
              return ['vaccines', 'ingridients', 'diseases'].indexOf(article.type.id) !== -1
            }

            var indexData = articles.map(a => {
              var parentPath = ''
              if (isInCategory(a)) {
                var parent = categoryParentMap[a.type.id]
                parentPath = `${parent.type.id}/${parent.url}/`
              }
              var fullUrl = `${parentPath}${a.type.id}/${a.url}`

              return {
                url: a.url,
                title: a.title,
                content: a.content,
                fullUrl
              }
            })

            var index = client.initIndex('pages')
            index.clearIndex((err, content) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  data: err
                })
              }
            })
            index.addObjects(indexData, (err, content) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  data: err
                })
              } else {
                searchIndex.lastUpdatedBy = req.user.name
                searchIndex.lastUpdatedOn = Date.now()

                searchIndex.save((err, searchIndex) => {
                  if (err) {
                    res.status(400).json({
                      success: false,
                      data: err
                    })
                  } else {
                    res.json({
                      success: true,
                      data: {
                        searchIndex
                      }
                    })
                  }
                })
              }
            })
          })
      } else {
        res.status(404).json({
          success: false,
          data: {}
        })
      }
    })
})

module.exports = searchIndexRoutes
