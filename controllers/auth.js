const jwt = require("jsonwebtoken")
const User = require("../models/user")
const config = require("../config/config")

exports.login = (req, res, next) => {
  let userInfo = setUserInfo(req.user)
  res.status(200).json({
    token: generateToken(userInfo),
    user: userInfo
  })
}

exports.register = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  if (!email) return res.status(422).send({ message: "You must provide an email address." })
  if (!password) return res.status(422).send({ message: "You must provide a password." })

  User.findOne({ email: email }, (err, existingUser) => {
    if (err) return next(err)

    if (existingUser) {
      return res.status(409).send({ error: "That email address is already registered." })
    }

    let user = new User({
      email: email,
      password: password
    })

    user.save(function (err, result) {
      if (err) {
        res.status(500).send({ message: err.message })
        return next()
      }

      let userInfo = setUserInfo(result)
      res.status(201).json({
        token: generateToken(userInfo),
        user: userInfo
      })
    })
  })
}

function generateToken(payload) {
  return jwt.sign(payload, config.secret, { expiresIn: 86400 })
}

function setUserInfo(userData) {
  return {
    _id: userData._id,
    email: userData.email
  }
}
