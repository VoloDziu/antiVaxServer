var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var jsonSelect = require('mongoose-json-select')
var Schema = mongoose.Schema

var userSchema = new Schema({
  id: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  admin: Boolean,
  lastLoggedInAt: Date
})

userSchema.plugin(jsonSelect, '-password')
module.exports = mongoose.model('User', userSchema)
