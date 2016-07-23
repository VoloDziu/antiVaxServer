var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema
var striptags = require('striptags')

var questionSchema = new Schema({
  posterName: {
    type: String,
    required: [true, 'name cannot be empty']
  },
  posterEmail: {
    type: String,
    required: [true, 'email cannot be empty']
  },
  question: {
    type: String,
    validate: {
      validator: (v) => striptags(v) !== '',
      message: 'question cannot be empty'
    },
    required: [true, 'question cannot be empty']
  },
  isSeen: {
    type: Boolean,
    default: false
  },
  createdAt: Date
})

module.exports = mongoose.model('Question', questionSchema)
