const chalk = require("chalk")
const fs = require("fs")
const mkdirp = require("mkdirp")
const path = require("path")

module.exports = {
  command: "init:queue",
  async action() {
    const queuesDirPath = path.join(__dirname, "../utils/queues")
    if (fs.existsSync(queuesDirPath)) {
      return console.info(chalk.red("queue already initialized"))
    }

    mkdirp.sync(queuesDirPath)
    fs.writeFileSync(path.join(queuesDirPath, ".gitkeep"), "")

    const queueMakerTemplateFilePath = path.join(
      __dirname,
      "../assets/templates/mustache/queueMakerFile.mustache"
    )
    const queueMakerFilePath = path.join(queuesDirPath, "../queueMaker.js")

    fs.copyFileSync(queueMakerTemplateFilePath, queueMakerFilePath)

    console.info(chalk.green("queue initialized"))
    process.exit()
  }
}
