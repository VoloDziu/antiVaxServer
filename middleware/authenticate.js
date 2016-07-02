const jwt = require('jsonwebtoken')

var authenticate = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {
    try {
      const user = jwt.verify(token, process.env.AUTH_SERVER_SECRET)
      req.user = user
      next()
    } catch (err) {
      return res.status(401).json({ message: 'Token invalid or expired. Please, log in again.' })
    }
  } else {
    return res.status(400).json({
      message: 'No token provided.'
    })
  }
}

module.exports = authenticate
