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
  async action(/** @type {string} */ modelName) {
    const data = {
      model: pluralize.singular(modelName),
      Model: ucfirst(pluralize.singular(modelName))
    }
    const modelFilePath = path.join(__dirname, "../models/", data.Model + ".js")
    const modelPropertiesFilePath = path.join(
      __dirname,
      "../models/",
      data.model,
      data.model + "ModelProperties.js"
    )
    const modelTypeDefsFilePath = path.join(
      __dirname,
      "../models/",
      data.model,
      data.model + "TypeDefs.js"
    )
    const modelTemplatePath = path.join(__dirname, "../assets/templates/mustache/model.mustache")
    const modelPropertiesTemplateFilePath = path.join(
      __dirname,
      "../assets/templates/mustache/modelProperties.mustache"
    )
    const modelTypeDefsTemplatePath = path.join(
      __dirname,
      "../assets/templates/mustache/modelTypeDefs.mustache"
    )
    const modelDirectories = [
      path.join(__dirname, "../models/", data.model),
      path.join(__dirname, "../models/", data.model, "statics"),
      path.join(__dirname, "../models/", data.model, "methods"),
      path.join(__dirname, "../models/", data.model, "middleware")
    ]

    if (fs.existsSync(modelFilePath) || fs.existsSync(modelPropertiesFilePath)) {
      console.info(chalk.red("model or modelProperties file already exists"))
      return false
    }

    // create directories
    modelDirectories.forEach(dir => {
      fs.mkdirSync(dir)
      const gitKeepPath = path.join(__dirname, "../assets/templates/mustache/.gitkeep")
      fs.copyFileSync(gitKeepPath, path.join(dir, ".gitkeep"))
    })

    // create model file
    fs.writeFileSync(
      modelFilePath,
      await formatCode(mustache.render(fs.readFileSync(modelTemplatePath, "utf-8"), data))
    )

    // create properties file
    fs.writeFileSync(
      modelPropertiesFilePath,
      await formatCode(
        mustache.render(fs.readFileSync(modelPropertiesTemplateFilePath, "utf-8"), {
          ...data,
          withoutProperties: true
        })
      )
    )

    // create type defs file
    fs.writeFileSync(
      modelTypeDefsFilePath,
      await formatCode(
        mustache.render(fs.readFileSync(modelTypeDefsTemplatePath, "utf-8"), {
          ...data,
          withoutMethods: true,
          withoutStatics: true,
          withoutFields: true
        })
      )
    )

    console.info(chalk.green(data.model + " model created"))
    process.exit()
  }
}
