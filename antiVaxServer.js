var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var morgan = require('morgan')
var mongoose = require('mongoose')

var authRoutes = require('./routes/auth')
var sectionsRoutes = require('./routes/sections')
var usersRoutes = require('./routes/users')
var blogpostsRoutes = require('./routes/blogposts')
var questionsRoutes = require('./routes/questions')
var faqRoutes = require('./routes/faq')

var port = process.env.PORT || 3000
mongoose.connect(`mongodb://${process.env.ANTIVAX_SERVER_DB_USER}:${process.env.ANTIVAX_SERVER_DB_PASS}@${process.env.ANTIVAX_SERVER_DB_HOST}/${process.env.ANTIVAX_SERVER_DB_NAME}`)

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// use morgan to log requests to the console
app.use(morgan('dev'))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get(`/${process.env.ANTIVAX_SERVER_API_PREFIX}`, (req, res) => {
  res.json({
    success: true,
    data: {},
    message: 'yes, I am working'
  })
})

app.use(`${process.env.ANTIVAX_SERVER_API_PREFIX}/auth`, authRoutes)
app.use(`${process.env.ANTIVAX_SERVER_API_PREFIX}/sections`, sectionsRoutes)
app.use(`${process.env.ANTIVAX_SERVER_API_PREFIX}/users`, usersRoutes)
app.use(`${process.env.ANTIVAX_SERVER_API_PREFIX}/blogposts`, blogpostsRoutes)
app.use(`${process.env.ANTIVAX_SERVER_API_PREFIX}/questions`, questionsRoutes)
app.use(`${process.env.ANTIVAX_SERVER_API_PREFIX}/faq`, faqRoutes)
app.listen(port)
