const chai = require("chai")
const chaiHttp = require("chai-http")
const User = require("../models/user")
const app = require("../app")

let should = chai.should()
chai.use(chaiHttp)

describe("Users", () => {
  beforeEach((done) => {
    User.remove({}, (err) => {
      done()
    })
  })

  describe("POST /auth/register", () => {
    it("should register a user when given the correct user data", (done) => {
      let user = {
        email: "user1@example.com",
        password: "user"
      }
      chai.request(app).post("/auth/register").send(user).end((err, res) => {
        res.should.have.status(201)
        res.body.should.be.an("object")
        res.body.should.have.property("token")
        res.body.should.have.property("user")
        done()
      })
    })

    it("should not add a user without an email address", (done) => {
      let user = {
        password: "user"
      }
      chai.request(app).post("/auth/register").send(user).end((err, res) => {
        res.should.have.status(422)
        res.body.should.be.an("object")
        res.body.should.have.property("message")
        done()
      })
    })
  })
})
