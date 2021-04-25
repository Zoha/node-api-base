const chalk = require("chalk")
const fs = require("fs")
const path = require("path")

module.exports = {
  command: "init:socket",
  async action() {
    const socketsPath = path.join(__dirname, "../sockets")
    if (fs.existsSync(socketsPath)) {
      return console.info(chalk.red("socket already initialized"))
    }
    const socketInitTemplateFilePath = path.join(
      __dirname,
      "../assets/templates/socketInitFile.mustache"
    )
    const socketInitFilePath = path.join(__dirname, "../utils/init/", "initSocket.js")

    const socketUtilTemplateFilePath = path.join(
      __dirname,
      "../assets/templates/socketUtilFile.mustache"
    )
    const socketUtilFilePath = path.join(__dirname, "../utils/", "socket.js")

    const socketRootNamespaceTemplateFilePath = path.join(
      __dirname,
      "../assets/templates/socketRootNamespace.mustache"
    )
    const socketRootNamespaceFilePath = path.join(__dirname, "../sockets/", "index.js")

    fs.copyFileSync(socketInitTemplateFilePath, socketInitFilePath)
    fs.copyFileSync(socketUtilTemplateFilePath, socketUtilFilePath)
    fs.mkdirSync(socketsPath)
    fs.copyFileSync(socketRootNamespaceTemplateFilePath, socketRootNamespaceFilePath)
    console.info(chalk.green("socket initialized"))
    process.exit()
  }
}
