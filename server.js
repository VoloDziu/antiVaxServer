var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var morgan = require('morgan')
var mongoose = require('mongoose')

var authRoutes = require('./routes/auth')
var sectionRoutes = require('./routes/section')

var port = process.env.PORT || 8080
mongoose.connect(`mongodb://${process.env.AUTH_SERVER_DB_USER}:${process.env.AUTH_SERVER_DB_PASS}@${process.env.AUTH_SERVER_DB_HOST}/${process.env.AUTH_SERVER_DB_NAME}`)

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// use morgan to log requests to the console
app.use(morgan('dev'))

app.use('/auth', authRoutes)
app.use('/sections', sectionRoutes)
app.listen(port)
console.log('Magic happens at http://localhost:' + port)
