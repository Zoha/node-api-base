const fs = require("fs")
const path = require("path")
const ejs = require("ejs")
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
    const modelSchemaFilePath = path.join(
      __dirname,
      "../models/",
      data.model,
      data.model + "Schema.js"
    )
    const modelTemplatePath = path.join(__dirname, "../assets/templates/model.ejs")
    const modelSchemaTemplatePath = path.join(__dirname, "../assets/templates/modelSchema.ejs")
    const modelDirectories = [
      path.join(__dirname, "../models/", data.model),
      path.join(__dirname, "../models/", data.model, "statics"),
      path.join(__dirname, "../models/", data.model, "methods")
    ]

    if (fs.existsSync(modelFilePath) || fs.existsSync(modelSchemaFilePath)) {
      console.info(chalk.red("model or schema file already exists"))
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
      await formatCode(ejs.render(fs.readFileSync(modelTemplatePath, "utf-8"), data))
    )

    // create schema
    fs.writeFileSync(
      modelSchemaFilePath,
      await formatCode(ejs.render(fs.readFileSync(modelSchemaTemplatePath, "utf-8"), data))
    )

    console.info(chalk.green(data.model + " model created"))
  }
}
