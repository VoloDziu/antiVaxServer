var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var sectionSchema = new Schema({
  url: {
    type: String,
    required: [true, 'url cannot be empty'],
    index: true,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'title cannot be empty']
  },
  sectionType: {
    type: String,
    enum: ['parent', 'articles', 'blogposts', 'custom'],
    default: 'articles'
  },
  meta: {
    type: Boolean,
    default: false
  },
  layout: {
    type: String,
    enum: ['list', 'grid']
  },
  customId: String,
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Section',
    default: null
  },
  children: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Section'
    }],
    default: []
  },
  articles: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Article'
    }],
    default: []
  },
  createdBy: String,
  createdAt: Date,
  lastModifiedBy: String,
  lastModifiedAt: Date
})

sectionSchema.plugin(uniqueValidator, { message: '{VALUE} is already taken' })
module.exports = mongoose.model('Section', sectionSchema)
