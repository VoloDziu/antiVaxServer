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
  published: {
    type: Boolean,
    default: false
  },
  lastModifiedBy: String,
  lastModifiedAt: Date
})

module.exports = mongoose.model('Faq', faqSchema)
