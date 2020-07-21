const dotenv = require("dotenv")
const path = require("path")
const fs = require("fs")
const chalk = require("chalk")

const envFilePath = path.join(__dirname, "../.env")
const envExampleFilePath = path.join(__dirname, "../.env.example")

if (fs.existsSync(envFilePath)) {
  dotenv.config({
    path: envFilePath
  })
} else {
  console.log(chalk.yellow("env file not exists. app will use `.env.example` instead"))
  dotenv.config({
    path: envExampleFilePath
  })
}

module.exports = (key, defaultValue) => {
  const envValue = process.env[key]
  if (!envValue) {
    return defaultValue || undefined
  }

  if (["true", "false"].includes(envValue)) {
    return envValue === "true"
  }

  if (typeof envValue === "string" && /^\d+$/.test(envValue)) {
    return Number(envValue)
  }

  return envValue
}
