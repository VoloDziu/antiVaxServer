var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var questionSchema = new Schema({
  id: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  seen: {
    type: Boolean,
    default: false
  },
  posterName: {
    type: String,
    required: true
  },
  posterEmail: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  postedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Question', questionSchema)
