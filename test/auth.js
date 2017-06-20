const chai = require("chai")
const chaiHttp = require("chai-http")
const User = require("../models/user")
const app = require("../app")

let should = chai.should()
chai.use(chaiHttp)

describe("Users", () => {
  beforeEach((done) => {
    User.remove({}, (err) => {
      User.create({ email: "user1@example.com", password: "user" }, (err, user) => {
        done()
      })
    })
  })

  describe("POST /auth/register", () => {
    it("should register a user when given the correct user data", (done) => {
      let user = {
        email: "user2@example.com",
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

    it("should not add a user with a duplicate email address", (done) => {
      let user = {
        email: "user1@example.com",
        password: "user"
      }
      chai.request(app).post("/auth/register").send(user).end((err, res) => {
        res.should.have.status(409)
        res.body.should.be.an("object")
        res.body.should.have.property("message")
        done()
      })
    })
  })

  describe("POST /auth/login", () => {
    it("should return an error when given an invalid email address", (done) => {
      let user = {
        email: "nonexistent@example.com",
        password: "user"
      }
      chai.request(app).post("/auth/login").send(user).end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it("should return an error when given an invalid password", (done) => {
      let user = {
        email: "user1@example.com",
        password: "wrong"
      }
      chai.request(app).post("/auth/login").send(user).end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })

    it("should return a token when given valid user login info", (done) => {
      let user = {
        email: "user1@example.com",
        password: "user"
      }
      chai.request(app).post("/auth/login").send(user).end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an("object")
        res.body.should.have.property("token")
        res.body.should.have.property("user")
        done()
      })
    })
  })
})
