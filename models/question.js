var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var questionSchema = new Schema({
  url: {
    type: String,
    required: [true, 'url cannot be empty'],
    index: true,
    unique: true
  },
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
    required: [true, 'question cannot be empty']
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isSeen: {
    type: Boolean,
    default: false
  },
  createdAt: Date
})

questionSchema.plugin(uniqueValidator, { message: '{VALUE} is already taken' })
module.exports = mongoose.model('Question', questionSchema)
