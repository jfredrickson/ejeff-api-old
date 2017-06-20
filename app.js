const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const app = express()

const config = require("./config/config")
const projectController = require("./controllers/project")
const authController = require("./controllers/auth")
const authService = require("./services/auth")

app.use(bodyParser.json())

let api = express.Router()
let auth = express.Router()

api.get("/projects", projectController.get)
api.post("/projects", authService.requireAuth, authService.requireAdminRole, projectController.post)

auth.post("/register", authController.register)
auth.post("/login", authService.requireLogin, authController.login)

app.use("/api", api)
app.use("/auth", auth)

mongoose.Promise = global.Promise
mongoose.connect(config.databaseUrl, (err, db) => {
  if (!err) console.log("Connected to MongoDB")
})

let server = app.listen(config.port, () => {
  console.log(`Listening on port ${server.address().port} (environment: ${config.env})`)
})

module.exports = app
