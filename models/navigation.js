var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var navigationSchema = new Schema({
  order: {
    type: Number,
    required: [true, 'order cannot be empty']
  },
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
  layout: {
    type: String,
    enum: ['grid', 'list', 'code'],
    default: 'grid'
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Navigation',
    default: null
  },
  children: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Navigation'
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

navigationSchema.plugin(uniqueValidator, { message: '{VALUE} is already taken' })
module.exports = mongoose.model('Navigation', navigationSchema)
