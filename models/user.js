const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Regular", "Admin"],
    default: "Regular"
  }
})

UserSchema.pre("save", function (next) {
  const user = this
  const SALT_FACTOR = 8

  if (!user.isModified("password")) return next()

  bcrypt.hash(user.password, SALT_FACTOR, (err, hash) => {
    if (err) return next(err)
    user.password = hash
    next()
  })
})

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, match) => {
    if (err) return cb(err)
    cb(null, match)
  })
}

module.exports = mongoose.model("User", UserSchema)
