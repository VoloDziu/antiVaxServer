var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema
var striptags = require('striptags')

var replySchema = new Schema({
  content: {
    type: String,
    validate: {
      validator: (v) => striptags(v) !== '',
      message: 'reply cannot be empty'
    },
    required: [true, 'reply cannot be empty']
  },
  createdAt: Date,
  lastModifiedBy: String,
  lastModifiedAt: Date
})

var commentSchema = new Schema({
  content: {
    type: String,
    validate: {
      validator: (v) => striptags(v) !== '',
      message: 'comment cannot be empty'
    },
    required: [true, 'comment cannot be empty']
  },
  createdAt: Date,
  lastModifiedBy: String,
  lastModifiedAt: Date,
  replies: {
    type: [replySchema],
    default: []
  }
})

var blogpostSchema = new Schema({
  url: {
    type: String,
    required: [true, 'url cannot be empty'],
    index: true,
    unique: true
    // TODO: add no-spaces validation
  },
  title: {
    type: String,
    required: [true, 'title cannot be empty'],
    unique: true
  },
  snippet: {
    type: String,
    default: ''
  },
  content: String,
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: Date,
  lastModifiedBy: String,
  lastModifiedAt: Date,
  publishedAt: Date,
  publishedBy: String,
  comments: {
    type: [commentSchema],
    default: []
  }
})

blogpostSchema.plugin(uniqueValidator, { message: '{VALUE} is already taken' })
module.exports = mongoose.model('Blogpost', blogpostSchema)
