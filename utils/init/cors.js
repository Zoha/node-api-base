const config = require("@config")
const cors = require("cors")

module.exports = app => {
  const whiteList = Array.isArray(config.accessOrigins)
    ? config.accessOrigins
    : [config.accessOrigins]
  const corsOptions = {
    origin: whiteList
  }
  app.use(cors(corsOptions))
}
