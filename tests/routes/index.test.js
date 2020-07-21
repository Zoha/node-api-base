const request = require("supertest")
require("module-alias/register")
const app = require("../../index")
const { expect } = require("chai")

describe("index route basic test", () => {
  it("will return proper json message", async () => {
    await request(app)
      .get("/")
      .expect(200)
      .expect(res => {
        const response = JSON.parse(res.text)
        expect(response).to.haveOwnProperty("message")
      })
  })
})
