require("module-alias/register")
const express = require("express")
const chalk = require("chalk")
const loadFilesIn = require("@utils/loadFilesIn")
const config = require("@config")
const environments = require("@enums/environments")

const app = express()
const port = config.port

// load init files
loadFilesIn(__dirname, "utils/init", { data: [app] })

// load all models
loadFilesIn(__dirname, "models")

app.use(require("./routes"))

if (config.nodeEnv !== environments.test) {
  app.listen(port, () => {
    console.info(chalk.green(`app is running on port ${port}`))
  })
}

module.exports = app
