var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var morgan = require('morgan')
var mongoose = require('mongoose')

var authRoutes = require('./routes/auth')
var sectionsRoutes = require('./routes/sections')
var usersRoutes = require('./routes/users')

var port = process.env.PORT || 8080
mongoose.connect(`mongodb://${process.env.ANTIVAX_SERVER_DB_USER}:${process.env.ANTIVAX_SERVER_DB_PASS}@${process.env.ANTIVAX_SERVER_DB_HOST}/${process.env.ANTIVAX_SERVER_DB_NAME}`)

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// use morgan to log requests to the console
app.use(morgan('dev'))

app.get(`${process.env.ANTIVAX_SERVER_API_PREFIX}/`, (req, res) => {
  res.json({message: 'hello world'})
})

app.use(`${process.env.ANTIVAX_SERVER_API_PREFIX}/auth`, authRoutes)
app.use(`${process.env.ANTIVAX_SERVER_API_PREFIX}/sections`, sectionsRoutes)
app.use(`${process.env.ANTIVAX_SERVER_API_PREFIX}/users`, usersRoutes)
app.listen(port)
