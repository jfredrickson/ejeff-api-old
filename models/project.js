const mongoose = require("mongoose")

module.exports = mongoose.model("Project", {
  title: { type: String, required: true },
  summary: String,
  details: String
})
