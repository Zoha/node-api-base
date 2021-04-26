const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const mustache = require("mustache")
const formatCode = require("@utils/formatCode")

module.exports = {
  command: "make:socketEmit  <emit>",
  async action(emit) {
    const socketsDir = path.join(__dirname, "../sockets")
    if (!fs.existsSync(socketsDir)) {
      return console.info(chalk.red("sockets folder does not exists"))
    }

    // check that emit file already exist or not
    const emitFilePath = path.join(socketsDir, `emits/${emit}Emit.js`)
    if (fs.existsSync(emitFilePath)) {
      return console.info(chalk.red("emit already exists"))
    }

    // create emit file
    const socketEmitTemplateFilePath = path.join(
      __dirname,
      "../assets/templates/mustache/socketEmitFile.mustache"
    )

    fs.writeFileSync(
      emitFilePath,
      await formatCode(mustache.render(fs.readFileSync(socketEmitTemplateFilePath, "utf-8")))
    )

    console.info(chalk.green("socket emit created successfully"))
    process.exit()
  }
}
