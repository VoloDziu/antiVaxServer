var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var faqSchema = new Schema({
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
  lastModifiedAt: Date
})

faqSchema.plugin(uniqueValidator, { message: '{VALUE} is already taken' })
module.exports = mongoose.model('Faq', faqSchema)
