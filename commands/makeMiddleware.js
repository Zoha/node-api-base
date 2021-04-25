const path = require("path")
const fs = require("fs")
const chalk = require("chalk")
const formatCode = require("@utils/formatCode")
const mustache = require("mustache")

module.exports = {
  command: "make:middleware <middleware>",
  async action(middleware) {
    const middlewareDirPath = path.join(__dirname, "../middleware/")
    const middlewareTemplateFilePath = path.join(
      __dirname,
      "../assets/templates/middlewareFile.mustache"
    )
    const middlewareFilePath = path.join(middlewareDirPath, `${middleware}Middleware.js`)

    fs.writeFileSync(
      middlewareFilePath,
      await formatCode(
        mustache.render(fs.readFileSync(middlewareTemplateFilePath, "utf-8"), {
          middleware
        })
      )
    )

    console.info(chalk.green("middleware file created"))
    process.exit()
  }
}
