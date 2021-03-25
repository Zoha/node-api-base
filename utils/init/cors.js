const config = require("@config")
const cors = require("cors")

module.exports = app => {
  const whiteList = Array.isArray(config.accessOrigins)
    ? config.accessOrigins
    : [config.accessOrigins]
  const corsOptions = {
    origin: function(origin, callback) {
      if (whiteList.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    }
  }
  app.use(cors(corsOptions))
}
