var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var searchIndexSchema = new Schema({
  lastUpdatedBy: String,
  lastUpdatedOn: Date
})

module.exports = mongoose.model('SearchIndex', searchIndexSchema)
