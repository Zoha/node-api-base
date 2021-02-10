const config = require("@config")

module.exports = (err, req, res, next) => {
  let data = {
    message: err.message || "an error happened"
  }

  if ((config.nodeEnv !== "production" || config.isTest) && err.stack) {
    // add stack in development env
    data.stack = err.stack.split("\n").map(i => i.trim())
  }

  if (config.nodeEnv !== "production") {
    console.info(err)
  }

  if (!res.headersSent) {
    if (!res.statusCode || res.statusCode === 200) {
      res.status(500)
    }

    res.json(data)
  }
  next(err)
}