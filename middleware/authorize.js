const authorize = (req, res, next) => {
  const user = req.user._doc
  const app = req.headers['x-access-app']

  if (app) {
    if (user.apps.indexOf(app) === -1) {
      res.status(401).json({
        success: false,
        data: {},
        message: `${user.name} has no access to this web app.`
      })
    } else {
      next()
    }
  } else {
    res.status(400).json({
      success: false,
      data: {},
      message: 'No target app provided'
    })
  }
}

module.exports = authorize
