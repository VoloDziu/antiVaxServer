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
  admin: {
    type: Boolean,
    required: true
  }
})

userSchema.plugin(jsonSelect, 'id name email admin')
module.exports = mongoose.model('User', userSchema)
