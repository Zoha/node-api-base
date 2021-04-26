const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const mustache = require("mustache")
const formatCode = require("@utils/formatCode")

module.exports = {
  command: "make:socketMiddleware <middlewareName>",
  async action(middlewareName) {
    const socketsDir = path.join(__dirname, "../sockets")
    if (!fs.existsSync(socketsDir)) {
      return console.info(chalk.red("sockets folder does not exists"))
    }

    // check that middleware already exist or not
    const middlewareFilePath = path.join(
      socketsDir,
      `middleware/${middlewareName}SocketMiddleware.js`
    )
    if (fs.existsSync(middlewareFilePath)) {
      return console.info(chalk.red("middleware already exists"))
    }

    // create middleware file
    const middlewareTemplateFile = path.join(
      __dirname,
      "../assets/templates/mustache/socketMiddlewareFile.mustache"
    )

    fs.writeFileSync(
      middlewareFilePath,
      await formatCode(mustache.render(fs.readFileSync(middlewareTemplateFile, "utf-8")))
    )

    console.info(chalk.green("socket middleware created successfully"))
    process.exit()
  }
}
