const ejs = require("ejs")
const changeCase = require("change-case")
const path = require("path")
const fs = require("fs")
const chalk = require("chalk")
const formatCode = require("@utils/formatCode")

module.exports = {
  command: "make:enum <name> <items...>",
  options: [],
  action: async (name, items) => {
    name = changeCase.camelCase(name.replace(/\.js$/, ""))

    const enumTemplatePath = path.join(__dirname, "../assets/templates/enum.ejs")
    const newEnumFilePath = path.join(__dirname, "../enums/", name + ".js")

    items = items.map(item => ({
      key: changeCase.camelCase(item),
      value: changeCase.camelCase(item)
    }))

    if (fs.existsSync(newEnumFilePath)) {
      console.info(chalk.red("this enum already exists"))
      return false
    }
    fs.writeFileSync(
      newEnumFilePath,
      await formatCode(ejs.render(fs.readFileSync(enumTemplatePath, "utf-8"), { items }))
    )
    console.info(chalk.green("enum created"))
  }
}
