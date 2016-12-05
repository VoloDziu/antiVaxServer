var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var sectionItemSchema = new Schema({
  heading: String,
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }
})

var sectionSchema = new Schema({
  url: {
    type: String,
    required: [true, 'url cannot be empty'],
    index: true,
    unique: true
    // TODO: add no-spaces validation
  },
  title: {
    type: String,
    required: [true, 'title cannot be empty']
  },
  items: {
    type: [sectionItemSchema],
    default: []
  },
  createdAt: Date,
  lastModifiedBy: String,
  lastModifiedAt: Date
})

sectionSchema.plugin(uniqueValidator, { message: '{VALUE} is already taken' })
module.exports = mongoose.model('Section', sectionSchema)
