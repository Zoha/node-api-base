const chalk = require("chalk")
const fs = require("fs")
const mkdirp = require("mkdirp")
const path = require("path")
const { spawnSync: execCommand } = require("child_process")

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

    const socketManagerTemplateFilePath = path.join(
      __dirname,
      "../assets/templates/socketManagerFile.mustache"
    )
    const socketManagerFilePath = path.join(socketsPath, "index.js")

    fs.copyFileSync(socketInitTemplateFilePath, socketInitFilePath)
    fs.copyFileSync(socketUtilTemplateFilePath, socketUtilFilePath)
    mkdirp.sync(path.join(socketsPath, "emits"))
    fs.writeFileSync(path.join(socketsPath, "emits/.gitkeep"), "")
    mkdirp.sync(path.join(socketsPath, "listeners"))
    mkdirp.sync(path.join(socketsPath, "middleware"))
    fs.writeFileSync(path.join(socketsPath, "middleware/.gitkeep"), "")
    fs.copyFileSync(socketManagerTemplateFilePath, socketManagerFilePath)

    console.info(execCommand("node", ["command", "make:socketNamespace", "root"]).stderr.toString())

    console.info(
      execCommand("node", ["command", "make:enum", "socketEvents", "connection"]).stderr.toString()
    )

    console.info(chalk.green("socket initialized"))
    process.exit()
  }
}
