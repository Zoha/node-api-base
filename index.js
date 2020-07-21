require("module-alias/register")
const express = require("express")
const chalk = require("chalk")
const loadFilesIn = require("@utils/loadFilesIn")
const config = require("@config")

const app = express()
const port = config.port

// load init files
loadFilesIn(__dirname, "utils/init")

// load all models
loadFilesIn(__dirname, "models")

app.use(require("./routes"))

if (config.nodeEnv !== "test") {
  app.listen(port, () => {
    console.log(chalk.green(`app is running on port ${3000}`))
  })
}

module.exports = app
