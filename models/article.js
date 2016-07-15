var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
var striptags = require('striptags')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var articleSchema = new Schema({
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
  createdAt: Date,
  lastModifiedBy: String,
  lastModifiedAt: Date
})

articleSchema.plugin(uniqueValidator, { message: '{VALUE} is already taken' })
module.exports = mongoose.model('Article', articleSchema)
