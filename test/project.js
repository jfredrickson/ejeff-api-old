const chai = require("chai")
const chaiHttp = require("chai-http")
const Project = require("../models/project")
const User = require("../models/user")
const app = require("../app")
const jwt = require("jsonwebtoken")
const config = require("../config/config")

let should = chai.should()
chai.use(chaiHttp)

describe("Projects", () => {
  let adminUser

  beforeEach((done) => {
    Project.remove({}, (err) => {
      done()
    })
  })

  beforeEach((done) => {
    User.remove({}, (err) => {
      User.create({ email: "user1@example.com", password: "user", role: "Admin" }, (err, user) => {
        adminUser = user
        done()
      })
    })
  })

  describe("GET /api/projects", () => {
    it("should get all projects", (done) => {
      chai.request(app).get("/api/projects").end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an("array")
        res.body.length.should.be.eql(0)
        done()
      })
    })
  })

  describe("POST /api/projects", () => {
    it("should add a project", (done) => {
      let project = {
        title: "Title",
        summary: "Summary",
        details: "Details"
      }
      let token = jwt.sign({_id: adminUser._id, email: adminUser.email}, config.secret, { expiresIn: 86400 })
      chai.request(app).post("/api/projects").set("Authorization", `JWT ${token}`).send(project).end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an("object")
        done()
      })
    })

    it("should not add a project without a title", (done) => {
      let project = {
        summary: "Summary",
        details: "Details"
      }
      let token = jwt.sign({_id: adminUser._id, email: adminUser.email}, config.secret, { expiresIn: 86400 })
      chai.request(app).post("/api/projects").set("Authorization", `JWT ${token}`).send(project).end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an("object")
        res.body.should.have.property("errors")
        res.body.errors.should.have.property("title")
        res.body.errors.title.should.have.property("kind").eql("required")
        done()
      })
    })
  })
})
