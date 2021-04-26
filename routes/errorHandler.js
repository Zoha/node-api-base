const config = require("@config")
const environments = require("@enums/environments")
const log = require("@utils/log")

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  let data = {
    message: err.message || "an error happened"
  }

  if (config.nodeEnv !== environments.production && err.stack) {
    // add stack in development env
    data.stack = err.stack.split("\n").map(i => i.trim())
  }

  if (config.nodeEnv !== environments.production) {
    if (res.statusCode >= 400 && res.statusCode < 500) log.info("request error", err)
    else log.error("request error", err)
  }

  if (!res.headersSent) {
    if (!res.statusCode || res.statusCode === 200) {
      res.status(500)
    }

    res.json(data)
  }
}
