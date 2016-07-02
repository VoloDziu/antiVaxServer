const authorize = (req, res, next) => {
  const user = req.user._doc
  const app = req.headers['x-access-app']

  if (app) {
    if (user.apps.indexOf(app) === -1) {
      res.status(401).json({ message: `${user.name} has no access to this web app.` })
    } else {
      next()
    }
  } else {
    res.status(400).json({
      message: 'No target app provided'
    })
  }
}

module.exports = authorize
