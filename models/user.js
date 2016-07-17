var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = require('bluebird')
var jsonSelect = require('mongoose-json-select')
var Schema = mongoose.Schema

var userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name cannot be empty']
  },
  email: {
    type: String,
    required: [true, 'email cannot be empty'],
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'password cannot be empty']
  },
  admin: {
    type: Boolean,
    default: false
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  lastLoggedInAt: Date,
  createdAt: Date
})

userSchema.plugin(uniqueValidator, { message: '{VALUE} is already taken' })
userSchema.plugin(jsonSelect, '-password')
module.exports = mongoose.model('User', userSchema)
