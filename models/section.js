var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var pageSchema = new Schema({
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
    required: [true, 'content cannot be empty']
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
  items: [this]
})
pageSchema.plugin(uniqueValidator, { message: '{VALUE} is already taken' })

var sectionSchema = new Schema({
  url: {
    type: String,
    required: [true, 'url cannot be empty'],
    index: true,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'title cannot be empty'],
    unique: true
  },
  createdAt: Date,
  lastModifiedBy: String,
  lastModifiedAt: Date,
  pages: [pageSchema]
})

sectionSchema.plugin(uniqueValidator, { message: '{VALUE} is already taken' })
module.exports = mongoose.model('Section', sectionSchema)
