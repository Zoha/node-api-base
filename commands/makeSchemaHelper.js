const { camelCase } = require("change-case")
const path = require("path")
const fs = require("fs")
const pluralize = require("pluralize")
const chalk = require("chalk")
const formatCode = require("@utils/formatCode")
const mustache = require("mustache")
const mkdirp = require("mkdirp")

module.exports = {
  command: "make:schemaHelper <schema> <helperName>",
  async action(schema, helperName) {
    schema = camelCase(pluralize.singular(schema))

    helperName = camelCase(helperName)

    const helperDir = path.join(__dirname, `../schemas/${schema}/${schema}Helpers`)
    if (!fs.existsSync(helperDir)) {
      mkdirp.sync(helperDir)
    }

    const helperFilePath = path.join(helperDir, `${helperName}.js`)

    if (fs.existsSync(helperFilePath)) {
      console.info(chalk.red("helper already exists"))
      return process.exit(0)
    }

    const helperFileTemplatePath = path.join(
      __dirname,
      "../assets/templates/schemaHelperFile.mustache"
    )

    fs.writeFileSync(
      helperFilePath,
      await formatCode(mustache.render(fs.readFileSync(helperFileTemplatePath, "utf-8")))
    )

    console.info(chalk.green("helper file created"))
    process.exit()
  }
}
