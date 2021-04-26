const chalk = require("chalk")
const fs = require("fs")
const mkdirp = require("mkdirp")
const path = require("path")

module.exports = {
  command: "init:view",
  action: async () => {
    const initFilePath = path.join(__dirname, `../utils/init/initExpressPug.js`)
    if (fs.existsSync(initFilePath)) {
      return console.info(chalk.red("already initialized"))
    }

    // copy init file
    fs.copyFileSync(
      path.join(__dirname, "../assets/templates/mustache/viewBaseInitExpressPugFile.mustache"),
      initFilePath
    )
    // copy middleware file
    fs.copyFileSync(
      path.join(__dirname, "../assets/templates/mustache/viewBaseLocalsMiddlewareFile.mustache"),
      path.join(__dirname, "../middleware/", `viewLocalsMiddleware.js`)
    )

    // move route files
    const files = fs.readdirSync(path.join(__dirname, "../routes/")).filter(i => i.endsWith(".js"))
    const apiNewPath = path.join(__dirname, "../routes/api")
    mkdirp.sync(apiNewPath)
    for (const file of files) {
      fs.renameSync(path.join(__dirname, "../routes/", file), path.join(apiNewPath, file))
    }

    // copy fallback file
    fs.copyFileSync(
      path.join(__dirname, "../routes/api/fallback.js"),
      path.join(__dirname, "../routes/fallback.js")
    )

    // copy error handler file
    fs.copyFileSync(
      path.join(__dirname, "../assets/templates/mustache/viewBaseErrorHandlerFile.mustache"),
      path.join(__dirname, "../routes/", `errorHandler.js`)
    )

    // copy index route file
    fs.copyFileSync(
      path.join(__dirname, "../assets/templates/mustache/viewBaseIndexRouteFile.mustache"),
      path.join(__dirname, "../routes/", `index.js`)
    )

    console.info(chalk.green("initialized"))
    process.exit()
  }
}
