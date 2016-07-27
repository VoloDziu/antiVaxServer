var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var Schema = mongoose.Schema

var scheduleSchema = new Schema({
  items: [
    {
      age: String,
      vaccines: [String]
    }
  ],
  lastModifiedBy: String,
  lastModifiedAt: Date
})

module.exports = mongoose.model('Schedule', scheduleSchema)
