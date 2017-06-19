const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const app = express()

const port = process.env.PORT || 3000
const dbUrl = process.env.DATABASE_URL || "mongodb://localhost/ejeff"

const projectController = require("./controllers/project")

app.use(bodyParser.json())

let api = express.Router()

api.get("/projects", projectController.get)
api.post("/projects", projectController.post)

app.use("/api", api)

mongoose.Promise = global.Promise
mongoose.connect(dbUrl, (err, db) => {
  if (!err) console.log("Connected to MongoDB")
})

app.listen(port, () => {
  console.log("Listening on port", port)
})

module.exports = app
