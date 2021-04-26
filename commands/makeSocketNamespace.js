const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const mustache = require("mustache")
const formatCode = require("@utils/formatCode")
const mkdirp = require("mkdirp")

module.exports = {
  command: "make:socketNamespace <namespace>",
  async action(namespace) {
    const socketsDir = path.join(__dirname, "../sockets")
    if (!fs.existsSync(socketsDir)) {
      return console.info(chalk.red("sockets folder does not exists"))
    }

    // namespace dir
    const namespaceDirPath = path.join(socketsDir, `listeners/${namespace}`)
    if (!fs.existsSync(namespaceDirPath)) {
      mkdirp.sync(namespaceDirPath)
    }

    // check that namespace file already exist or not
    const namespaceIndexFilePath = path.join(namespaceDirPath, `connection.js`)
    if (fs.existsSync(namespaceIndexFilePath)) {
      return console.info(chalk.red("namespace already exists"))
    }

    // create namespace file
    const namespaceIndexTemplateFilePath = path.join(
      __dirname,
      "../assets/templates/socketNamespaceIndexFile.mustache"
    )

    fs.writeFileSync(
      namespaceIndexFilePath,
      await formatCode(mustache.render(fs.readFileSync(namespaceIndexTemplateFilePath, "utf-8")))
    )

    console.info(chalk.green("socket namespace created successfully"))
    process.exit()
  }
}
