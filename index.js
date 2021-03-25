require("module-alias/register")
const express = require("express")
const chalk = require("chalk")
const loadFilesIn = require("@utils/loadFilesIn")
const config = require("@config")
const environments = require("@enums/environments")
const morgan = require("morgan")
const httpModule = require("http")

const port = config.port
const app = express()
const http = httpModule.createServer(app)

// inject ip to request
app.set("trust proxy", true)

// log requests
if (config.nodeEnv === environments.development) {
  app.use(morgan("tiny"))
}

// body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// load init files
loadFilesIn(__dirname, "utils/init", { data: [app, http] })

// load all models
loadFilesIn(__dirname, "models")
// load all schemas
loadFilesIn(__dirname, "schemas")

// load routes
app.use(require("./routes"))

if (config.nodeEnv !== environments.test) {
  app.listen(port, () => {
    console.info(chalk.green(`app is running on port ${port}`))
  })
}

module.exports = app
