const chai = require("chai")

let should = chai.should()

describe("Config", () => {
  let env
  let cache

  beforeEach((done) => {
    env = process.env
    cache = require.cache
    delete require.cache[require.resolve("../config/config")]
    done()
  })

  afterEach((done) => {
    process.env = env
    require.cache = cache
    done()
  })

  it("should load the development config for the development environment", (done) => {
    process.env.NODE_ENV = "development"
    let developmentConfig = require("../config/config")
    developmentConfig.should.have.property("env").eql("development")
    done()
  })

  it("should load the test config for the test environment", (done) => {
    process.env.NODE_ENV = "test"
    let testConfig = require("../config/config")
    testConfig.should.have.property("env").eql("test")
    done()
  })

  it("should load the production config for the production environment", (done) => {
    process.env.NODE_ENV = "production"
    let productionConfig = require("../config/config")
    productionConfig.should.have.property("env").eql("production")
    done()
  })
})
