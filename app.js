const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const app = express()

const port = process.env.PORT || 3000
const dbUrl = process.env.DATABASE_URL || "mongodb://localhost/ejeff"

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
mongoose.connect(dbUrl, (err, db) => {
  if (!err) console.log("Connected to MongoDB")
})

app.listen(port, () => {
  console.log("Listening on port", port)
})

module.exports = app
