var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var morgan = require('morgan')
var mongoose = require('mongoose')
var jwt = require('jsonwebtoken')

var User = require('./models/User')

var port = process.env.PORT || 8080
mongoose.connect(process.env.AUTH_SERVER_DB_URI)
app.set('secret', process.env.AUTH_SERVER_SECRET)

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// use morgan to log requests to the console
app.use(morgan('dev'))

var apiRoutes = express.Router()

apiRoutes.post('/authenticate', function (req, res) {
  User.findOne({
    name: req.body.name
  }, function (err, user) {
    if (err) {
      throw err
    }

    if (!user || user.password !== req.body.password) {
      res.json({ success: false, message: 'Authentication failed' })
    } else {
      var token = jwt.sign({
        name: user.name,
        admin: user.admin
      }, app.get('secret'), {
        expiresIn: '24h'
      })

      res.json({
        success: true,
        message: 'Authentication succeeded',
        token: token
      })
    }
  })
})

apiRoutes.use(function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {
    jwt.verify(token, app.get('secret'), function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    })
  }
})

apiRoutes.get('/users', function (req, res) {
  User.find({}, function (err, users) {
    if (err) {
      throw err
    }

    res.json(users)
  })
})

apiRoutes.get('/', (req, res) => {
  res.json({
    message: 'VELZ auth service'
  })
})

app.listen(port)
console.log('Magic happens at http://localhost:' + port)
