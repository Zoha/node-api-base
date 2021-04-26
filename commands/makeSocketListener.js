const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const mustache = require("mustache")
const formatCode = require("@utils/formatCode")

module.exports = {
  command: "make:socketListener <namespace> <listener>",
  async action(namespace, listener) {
    const socketsDir = path.join(__dirname, "../sockets")
    if (!fs.existsSync(socketsDir)) {
      return console.info(chalk.red("sockets folder does not exists"))
    }

    // check namespace
    const namespaceDirPath = path.join(socketsDir, `listeners/${namespace}`)
    if (!fs.existsSync(namespaceDirPath)) {
      return console.info(chalk.red("namespace does not exist"))
    }

    // check that listener file already exist or not
    const listenerFilePath = path.join(namespaceDirPath, `${listener}.js`)
    if (fs.existsSync(listenerFilePath)) {
      return console.info(chalk.red("listener already exists"))
    }

    // create listener file
    const socketListenerTemplateFilePath = path.join(
      __dirname,
      "../assets/templates/mustache/socketListenerFile.mustache"
    )

    fs.writeFileSync(
      listenerFilePath,
      await formatCode(mustache.render(fs.readFileSync(socketListenerTemplateFilePath, "utf-8")))
    )

    console.info(chalk.green("socket listener created successfully"))
    process.exit()
  }
}
