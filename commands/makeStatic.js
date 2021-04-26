const { pascalCase, camelCase } = require("change-case")
const path = require("path")
const fs = require("fs")
const pluralize = require("pluralize")
const chalk = require("chalk")
const formatCode = require("@utils/formatCode")
const mustache = require("mustache")

module.exports = {
  command: "make:static <modelName> <staticName>",
  async action(modelName, staticName) {
    modelName = pascalCase(pluralize.singular(modelName))

    const modelPath = path.join(__dirname, `../models/${modelName}.js`)

    if (!fs.existsSync(modelPath)) {
      console.info(chalk.red("model does not exists"))
      return process.exit(0)
    }

    staticName = camelCase(staticName)

    const staticFilePath = path.join(
      __dirname,
      `../models/${camelCase(modelName)}/statics/${staticName}.js`
    )

    if (fs.existsSync(staticFilePath)) {
      console.info(chalk.red("static file already exists"))
      return process.exit(0)
    }

    const staticFileTemplatePath = path.join(
      __dirname,
      "../assets/templates/mustache/staticFile.mustache"
    )

    fs.writeFileSync(
      staticFilePath,
      await formatCode(
        mustache.render(fs.readFileSync(staticFileTemplatePath, "utf-8"), {
          Model: modelName,
          model: camelCase(modelName)
        })
      )
    )

    console.info(chalk.green("static file created"))
    process.exit()
  }
}
