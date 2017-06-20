const chai = require("chai")
const chaiHttp = require("chai-http")
const Project = require("../models/project")
const app = require("../app")

let should = chai.should()
chai.use(chaiHttp)

describe("Projects", () => {
  beforeEach((done) => {
    Project.remove({}, (err) => {
      done()
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
        wat: "why",
        summary: "Summary",
        details: "Details"
      }
      chai.request(app).post("/api/projects").send(project).end((err, res) => {
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
      chai.request(app).post("/api/projects").send(project).end((err, res) => {
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
