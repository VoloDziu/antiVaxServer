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
  postedBy: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  content: String,
  postedAt: {
    type: Date,
    default: Date.now
  },
  seen: Boolean
})

module.exports = mongoose.model('Question', questionSchema)
