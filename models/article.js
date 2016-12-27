var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema
var striptags = require('striptags')

var replySchema = new Schema({
  content: {
    type: String,
    validate: {
      validator: (v) => striptags(v) !== '',
      message: 'reply cannot be empty'
    },
    required: [true, 'reply cannot be empty']
  },
  createdBy: String,
  createdAt: Date
})

var commentSchema = new Schema({
  content: {
    type: String,
    validate: {
      validator: (v) => striptags(v) !== '',
      message: 'comment cannot be empty'
    },
    required: [true, 'comment cannot be empty']
  },
  createdBy: String,
  createdAt: Date,
  replies: {
    type: [replySchema],
    default: []
  }
})

var articleSchema = new Schema({
  articleType: {
    type: String,
    enum: ['heading', 'article', 'blogpost'],
    default: 'article'
  },
  url: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'title cannot be empty'],
    unique: true
  },
  snippet: {
    type: String,
    default: ''
  },
  content: String,
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: String,
  createdAt: Date,
  lastModifiedBy: String,
  lastModifiedAt: Date,
  publishedBy: String,
  publishedAt: Date,
  comments: {
    type: [commentSchema],
    default: []
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Navigation'
  }
})

articleSchema.plugin(uniqueValidator, { message: '{VALUE} is already taken' })
module.exports = mongoose.model('Article', articleSchema)
