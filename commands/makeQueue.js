const formatCode = require("@utils/formatCode")
const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const mustache = require("mustache")

module.exports = {
  command: "make:queue <queue>",
  async action(queue) {
    const queuesDirPath = path.join(__dirname, "../utils/queues")
    if (!fs.existsSync(queuesDirPath)) {
      return console.info(chalk.red("queues dir does not exist"))
    }

    const queueFilePath = path.join(queuesDirPath, `${queue}Queue.js`)
    const queueTemplateFilePath = path.join(__dirname, "../assets/templates/queueFile.mustache")

    // create type defs file
    fs.writeFileSync(
      queueFilePath,
      await formatCode(
        mustache.render(fs.readFileSync(queueTemplateFilePath, "utf-8"), {
          queue
        })
      )
    )

    console.info(chalk.green("queue created"))
    process.exit()
  }
}
