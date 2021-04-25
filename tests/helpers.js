require("module-alias/register")
const request = require("supertest")
const app = require("@root/index")

module.exports = {
  request,
  app
}
