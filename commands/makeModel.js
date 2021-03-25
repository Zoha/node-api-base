const fs = require("fs")
const path = require("path")
const mustache = require("mustache")
const chalk = require("chalk")
const pluralize = require("pluralize")
const ucfirst = require("ucfirst")
const formatCode = require("@utils/formatCode")

module.exports = {
  command: "make:model <name>",
  options: [],
  async action(modelName) {
    const data = {
      model: pluralize.singular(modelName),
      Model: ucfirst(pluralize.singular(modelName))
    }
    const modelFilePath = path.join(__dirname, "../models/", data.Model + ".js")
    const modelFieldsFilePath = path.join(
      __dirname,
      "../models/",
      data.model,
      data.model + "Fields.js"
    )
    const modelTemplatePath = path.join(__dirname, "../assets/templates/model.mustache")
    const modelSchemaTemplatePath = path.join(__dirname, "../assets/templates/modelFields.mustache")
    const modelDirectories = [
      path.join(__dirname, "../models/", data.model),
      path.join(__dirname, "../models/", data.model, "statics"),
      path.join(__dirname, "../models/", data.model, "methods")
    ]

    if (fs.existsSync(modelFilePath) || fs.existsSync(modelFieldsFilePath)) {
      console.info(chalk.red("model or modelFields file already exists"))
      return false
    }

    // create directories
    modelDirectories.forEach(dir => {
      fs.mkdirSync(dir)
      const gitKeepPath = path.join(__dirname, "../assets/templates/.gitkeep")
      fs.copyFileSync(gitKeepPath, path.join(dir, ".gitkeep"))
    })

    // create model file
    fs.writeFileSync(
      modelFilePath,
      await formatCode(mustache.render(fs.readFileSync(modelTemplatePath, "utf-8"), data))
    )

    // create fields file
    fs.writeFileSync(
      modelFieldsFilePath,
      await formatCode(mustache.render(fs.readFileSync(modelSchemaTemplatePath, "utf-8"), data))
    )

    console.info(chalk.green(data.model + " model created"))
  }
}
