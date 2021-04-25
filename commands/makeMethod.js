const { pascalCase, camelCase } = require("change-case")
const path = require("path")
const fs = require("fs")
const pluralize = require("pluralize")
const chalk = require("chalk")
const formatCode = require("@utils/formatCode")
const mustache = require("mustache")

module.exports = {
  command: "make:method <modelName> <methodName>",
  async action(modelName, methodName) {
    modelName = pascalCase(pluralize.singular(modelName))

    const modelPath = path.join(__dirname, `../models/${modelName}.js`)

    if (!fs.existsSync(modelPath)) {
      console.info(chalk.red("model does not exists"))
      return process.exit(0)
    }

    methodName = camelCase(methodName)

    const methodFilePath = path.join(
      __dirname,
      `../models/${camelCase(modelName)}/methods/${methodName}.js`
    )

    if (fs.existsSync(methodFilePath)) {
      console.info(chalk.red("method file already exists"))
      return process.exit(0)
    }

    const methodFileTemplatePath = path.join(__dirname, "../assets/templates/methodFile.mustache")

    fs.writeFileSync(
      methodFilePath,
      await formatCode(
        mustache.render(fs.readFileSync(methodFileTemplatePath, "utf-8"), {
          Model: modelName,
          model: camelCase(modelName)
        })
      )
    )

    console.info(chalk.green("method file created"))
    process.exit()
  }
}
