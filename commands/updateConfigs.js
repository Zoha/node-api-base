const fs = require("fs")
const path = require("path")
const mustache = require("mustache")
const { camelCase } = require("change-case")
const chalk = require("chalk")
const lodash = require("lodash")
const formatCode = require("@utils/formatCode")
const { formatValue } = require("@utils/env")

const envFilePath = path.join(__dirname, "../.env")
const envExampleFilePath = path.join(__dirname, "../.env.example")

module.exports = {
  command: "update:configs",
  options: [],
  async action() {
    let envFileContent = ""
    if (fs.existsSync(envFilePath)) {
      envFileContent = fs.readFileSync(envFilePath, "utf-8")
    }
    const envExampleFileContent = fs.readFileSync(envExampleFilePath, "utf-8")

    /** @type {Array.<{key : string , value: any , originalKey? : string}>} */
    let configs = lodash.uniqBy(
      [...envFileContent.split("\n"), ...envExampleFileContent.split("\n")]
        .map(i => i.replace("\r", ""))
        .filter(line => line.length && !line.startsWith("#"))
        .map(i => ({
          key: /^([^=]+)=/.exec(i)[1],
          value: /^[^=]+=["']?([^"'\n]*)["']?/.exec(i)[1]
        })),
      "key"
    )

    configs = configs.map(config => {
      config.value = formatValue(config.value)
      if (typeof config.value === "string") {
        config.value = `"${config.value}"`
      } else if (typeof config.value === "object") {
        config.value = JSON.stringify(config.value)
      }

      config.originalKey = config.key
      config.key = camelCase(config.key)
      return config
    })

    fs.writeFileSync(
      path.join(__dirname, "../config.js"),
      await formatCode(
        mustache.render(
          fs.readFileSync(
            path.join(__dirname, "../assets/templates/mustache/configs.mustache"),
            "utf-8"
          ),
          { configs }
        )
      )
    )
    console.info(chalk.green("config file updated"))
    process.exit()
  }
}
