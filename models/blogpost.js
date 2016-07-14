var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
var striptags = require('striptags')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var commentSchema = new Schema({
  content: {
    type: String,
    required: [true, 'content cannot be empty']
  },
  createdAt: Date,
  lastModifiedBy: String,
  lastModifiedAt: Date,
  replies: {
    type: [this],
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
  content: {
    type: String,
    required: [true, 'content cannot be empty'],
    validate: {
      validator: (v) => {
        return striptags(v) !== ''
      },
      message: 'content cannot be empty'
    }
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: Date,
  lastModifiedBy: String,
  lastModifiedAt: Date,
  comments: {
    type: [commentSchema],
    default: []
  }
})

blogpostSchema.plugin(uniqueValidator, { message: '{VALUE} is already taken' })
module.exports = mongoose.model('Blogpost', blogpostSchema)
