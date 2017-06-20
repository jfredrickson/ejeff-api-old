const passport = require("passport")
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const LocalStrategy = require("passport-local")
const User = require("../models/user")
const config = require("../config/config")

exports.requireAuth = passport.authenticate("jwt", { session: false })
exports.requireLogin = passport.authenticate("local", { session: false })

exports.requireAdminRole = (req, res, next) => {
  if (req.user.role !== "Admin") {
    res.status(401).json({ message: "You must be an administrator to perform this function." })
  } else {
    next()
  }
}

const localStrategyOptions = { usernameField: "email" }
const localLogin = new LocalStrategy(localStrategyOptions, (email, password, done) => {
  User.findOne({ email: email }, (err, user) => {
    if (err) return done(err)
    if (!user) return done(null, false, { message: "Invalid username or password." })

    user.comparePassword(password, (err, match) => {
      if (err) return done(err)
      if (!match) return done(null, false, { message: "Invalid username or password." })
      return done(null, user)
    })
  })
})

const jwtStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: config.secret
}
const jwtLogin = new JwtStrategy(jwtStrategyOptions, (payload, done) => {
  User.findById(payload._id, (err, user) => {
    if (err) return done(err, false)
    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})

passport.use(jwtLogin)
passport.use(localLogin)
