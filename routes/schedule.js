var express = require('express')

var Schedule = require('../models/schedule')
var isRegistered = require('../middleware/authorization').isRegistered
var isAdmin = require('../middleware/authorization').isAdmin

var scheduleRoutes = express.Router()

// Get
scheduleRoutes.get('/', isRegistered, (req, res) => {
  Schedule.findOne()
    .then(schedule => {
      if (schedule) {
        res.json({
          success: true,
          data: {
            schedule
          }
        })
      } else {
        var newSchedule = new Schedule({
          items: []
        })

        newSchedule.save((err, schedule) => {
          if (err) {
            res.status(400).json({
              success: false,
              data: err
            })
          } else {
            res.json({
              success: true,
              data: {
                schedule
              }
            })
          }
        })
      }
    })
})

// Put
scheduleRoutes.put('/', isRegistered, isAdmin, (req, res) => {
  Schedule.findOne()
    .then(schedule => {
      if (schedule) {
        for (let prop in req.body.schedule) {
          if (prop === 'items') {
            schedule.items = req.body.schedule.items.filter(i => !i.isDeleted)
          } else {
            schedule[prop] = req.body.schedule[prop]
          }
        }

        schedule.lastModifiedBy = req.user.name
        schedule.lastModifiedAt = Date.now()

        schedule.save((err, schedule) => {
          if (err) {
            res.status(400).json({
              success: false,
              data: err
            })
          } else {
            res.json({
              success: true,
              data: {
                schedule
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

module.exports = scheduleRoutes
