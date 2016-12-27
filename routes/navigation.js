var express = require('express')
var ObjectId = require('mongoose').Types.ObjectId

var Navigation = require('../models/navigation')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var navigationRoutes = express.Router()

// Get
navigationRoutes.get('/', isRegistered, (req, res) => {
  Navigation.find({isChild: false})
    .sort('order')
    .populate({
      path: 'articles',
      select: '_id title articleType isPublished'
    })
    .populate({
      path: 'children',
      populate: {
        path: 'articles',
        select: '_id title articleType isPublished'
      }
    })
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
navigationRoutes.post('/', isRegistered, isAdmin, (req, res) => {
  Navigation.count({isChild: false})
    .then(count => {
      let newNavigation = new Navigation(Object.assign({}, req.body.navigation, {
        order: req.body.navigation.isChild ? -1 : count + 1,
        createdAt: Date.now(),
        createdBy: req.user.name,
        lastModifiedAt: Date.now(),
        lastModifiedBy: req.user.name
      }))

      if (!newNavigation.url) {
        newNavigation.url = Math.random().toString(36).substr(2, 10)
      }

      newNavigation.save((err, navigation) => {
        if (err) {
          res.status(400).json({
            success: false,
            data: err
          })
        } else {
          res.json({
            success: true,
            data: {
              navigation
            }
          })
        }
      })
    })
})

// Update
navigationRoutes.put('/:navigationId', isRegistered, isAdmin, (req, res) => {
  Navigation.findOne({_id: ObjectId(req.params.navigationId)})
    .then(navigation => {
      if (navigation) {
        for (let prop in req.body.navigation) {
          if (prop !== 'children') {
            navigation[prop] = req.body.navigation[prop]
          } else {
            navigation.children = [
              ...navigation.children,
              ...req.body.navigation.children
            ]
          }
        }

        navigation.lastModifiedBy = req.user.name
        navigation.lastModifiedAt = Date.now()

        navigation.save((err, navigation) => {
          if (err) {
            res.status(400).json({
              success: false,
              data: err
            })
          } else {
            res.json({
              success: true,
              data: navigation
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
navigationRoutes.delete('/:navigationId', isRegistered, isAdmin, (req, res) => {
  Navigation.findOne({_id: ObjectId(req.params.navigationId)})
    .then(navigation => {
      if (navigation.children.length) {
        Navigation.remove({_id: {$in: navigation.children}}, (err, data) => {
          if (err) {
            console.error(err)
          }
        })
      }

      if (navigation) {
        navigation.remove()

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

module.exports = navigationRoutes
