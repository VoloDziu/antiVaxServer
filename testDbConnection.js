var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

var url = `mongodb://${process.env.AUTH_SERVER_DB_USER}:${process.env.AUTH_SERVER_DB_PASS}@${process.env.AUTH_SERVER_DB_HOST}/${process.env.AUTH_SERVER_DB_NAME}`
MongoClient.connect(url, function (err, db) {
  assert.equal(null, err)
  console.log('Connected correctly to server.')
  db.close()
})
