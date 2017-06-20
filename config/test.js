module.exports = {
  env: "test",
  port: undefined, // Random port for test
  databaseUrl: process.env.DATABASE_URL || "mongodb://localhost/ejeff-test",
  secret: "ad74f09b3f0d8076c18c6769d88ff80e723b515206fc8c4677578eac8b2a8f7a0ff23d25964acbd3"
}
