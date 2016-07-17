const jwt = require('jsonwebtoken')

var isRegistered = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {
    try {
      const user = jwt.verify(token, process.env.ANTIVAX_SERVER_SECRET)
      req.user = user
      next()
    } catch (err) {
      return res.status(401).json({
        success: false,
        data: {
          error: 'Token invalid or expired'
        }
      })
    }
  } else {
    return res.status(401).json({
      success: false,
      data: {
        error: 'No authentication token'
      }
    })
  }
}

const isAdmin = (req, res, next) => {
  const user = req.user

  if (user.admin) {
    next()
  } else {
    res.status(401).json({
      success: false,
      data: {
        error: 'Your account does not grant admin access'
      }
    })
  }
}

module.exports.isRegistered = isRegistered
module.exports.isAdmin = isAdmin
