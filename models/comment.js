var mongoose = require('mongoose')
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
  replies: [this]
})

module.exports = mongoose.model('Comment', commentSchema)
