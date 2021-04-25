const { pascalCase, camelCase } = require("change-case")
const path = require("path")
const fs = require("fs")
const pluralize = require("pluralize")
const chalk = require("chalk")
const formatCode = require("@utils/formatCode")
const mustache = require("mustache")
const mkdirp = require("mkdirp")

module.exports = {
  command: "make:schemaRoute <schema> <routeName>",
  async action(schema, routeName) {
    schema = camelCase(pluralize.singular(schema))

    routeName = camelCase(routeName)

    const customRouteDir = path.join(__dirname, `../schemas/${schema}/${schema}Routes`)
    if (!fs.existsSync(customRouteDir)) {
      mkdirp.sync(customRouteDir)
    }

    const customRouteFilePath = path.join(customRouteDir, `${routeName}Route.js`)

    if (fs.existsSync(customRouteFilePath)) {
      console.info(chalk.red("customRoute already exists"))
      return process.exit(0)
    }

    const customRouteFileTemplatePath = path.join(
      __dirname,
      "../assets/templates/schemaCustomRouteFile.mustache"
    )

    fs.writeFileSync(
      customRouteFilePath,
      await formatCode(
        mustache.render(fs.readFileSync(customRouteFileTemplatePath, "utf-8"), {
          Model: pascalCase(schema),
          routeName
        })
      )
    )

    console.info(chalk.green("custom route file created"))
    process.exit()
  }
}
