const config = require("@config")
const cors = require("cors")

const whitelist = config.accessOrigins
const corsOptions = {
  origin: function(origin, callback) {
    if (!Array.isArray(whitelist)) {
      return whitelist === "*" || new RegExp(whitelist, "i").test(origin)
        ? callback(null, true)
        : callback(null, false)
    }

    if (whitelist.map(i => new RegExp(i, "i")).find(i => i.test(origin))) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  }
}

module.exports.corsOptions = corsOptions

module.exports = app => {
  app.use(cors(corsOptions))
}
