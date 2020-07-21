const path = require("path")
const fs = require("fs")
const chalk = require("chalk")
const del = require("del")

module.exports = {
  command: "install <appName>",
  options: ["-j, --just-env"],
  async action(appName, ctx) {
    appName = appName.toLowerCase()
    const packageJsonFilePath = path.join(__dirname, "../package.json")
    const envExampleFilePath = path.join(__dirname, "../.env.example")
    const envFilePath = path.join(__dirname, "../.env")
    const configFilePath = path.join(__dirname, "../config.js")

    if (!ctx.justEnv) {
      fs.writeFileSync(
        packageJsonFilePath,
        fs
          .readFileSync(packageJsonFilePath, "utf-8")
          .replace('name": "base-api', `name": "${appName}-api`)
          .replace(
            '"description": "base project api app"',
            `"description": "${appName} project api app"`
          )
      )

      fs.writeFileSync(
        envExampleFilePath,
        fs
          .readFileSync(envExampleFilePath, "utf-8")
          .replace('27017/baseTest"', `27017/${appName}Test"`)
          .replace('27017/base"', `27017/${appName}"`)
      )

      fs.writeFileSync(
        configFilePath,
        fs
          .readFileSync(configFilePath, "utf-8")
          .replace('27017/baseTest"', `27017/${appName}Test"`)
          .replace('27017/base"', `27017/${appName}"`)
      )

      console.log(chalk.green("app name setting done"))

      await del(path.join(__dirname, "../.git"))
    }

    fs.copyFileSync(envExampleFilePath, envFilePath)

    console.log(chalk.green("env.example file copied"))
  }
}
