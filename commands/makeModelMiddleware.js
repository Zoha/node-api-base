const { pascalCase, camelCase } = require("change-case")
const path = require("path")
const fs = require("fs")
const pluralize = require("pluralize")
const chalk = require("chalk")
const formatCode = require("@utils/formatCode")
const mustache = require("mustache")

module.exports = {
  command: "make:modelMiddleware <modelName> <middlewareName>",
  async action(modelName, middlewareName) {
    modelName = pascalCase(pluralize.singular(modelName))

    const modelPath = path.join(__dirname, `../models/${modelName}.js`)

    if (!fs.existsSync(modelPath)) {
      console.info(chalk.red("model does not exists"))
      return process.exit(0)
    }

    middlewareName = camelCase(middlewareName)

    const middlewareFilePath = path.join(
      __dirname,
      `../models/${camelCase(modelName)}/middleware/${middlewareName}.js`
    )

    if (fs.existsSync(middlewareFilePath)) {
      console.info(chalk.red("middleware file already exists"))
      return process.exit(0)
    }

    const middlewareFileTemplatePath = path.join(
      __dirname,
      "../assets/templates/mustache/modelMiddlewareFile.mustache"
    )

    fs.writeFileSync(
      middlewareFilePath,
      await formatCode(
        mustache.render(fs.readFileSync(middlewareFileTemplatePath, "utf-8"), {
          Model: modelName,
          model: camelCase(modelName)
        })
      )
    )

    console.info(chalk.green("middleware file created"))
    process.exit()
  }
}
