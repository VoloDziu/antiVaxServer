const authorize = (req, res, next) => {
  const user = req.user

  if (user.apps.indexOf(req.body.app) === -1) {
    res.status(401).json({ message: `${user.name} has no access to this web app.` })
  }
}

module.exports = authorize
