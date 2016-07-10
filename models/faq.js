var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var faqSchema = new Schema({
  id: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: Date,
  lastModifiedBy: String,
  lastModifiedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Faq', faqSchema)
