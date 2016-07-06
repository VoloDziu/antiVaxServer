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
        data: {},
        message: 'Token invalid or expired. Please, log in again.'
      })
    }
  } else {
    return res.status(401).json({
      success: false,
      data: {},
      message: 'No authentication token provided.'
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
      data: {},
      message: `${user.name} has no admin privileges.`
    })
  }
}

module.exports.isRegistered = isRegistered
module.exports.isAdmin = isAdmin
