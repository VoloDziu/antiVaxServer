var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var jsonSelect = require('mongoose-json-select')
var Schema = mongoose.Schema

var userSchema = new Schema({
  name: {
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

userSchema.plugin(jsonSelect, 'name admin')
module.exports = mongoose.model('User', userSchema)
