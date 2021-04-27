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
  console.info(chalk.yellow("env file not exists. app will use `.env.example` instead"))
  dotenv.config({
    path: envExampleFilePath
  })
}

const formatValue = (value, defaultValue = null) => {
  if (!value) {
    return defaultValue || undefined
  }

  if (["true", "false"].includes(value)) {
    return value === "true"
  }

  if (typeof value === "string" && /^\d+$/.test(value)) {
    return Number(value)
  }

  if (typeof value === "string" && value.includes(",")) {
    return value.split(",").map(i => i.trim())
  }

  return value
}

module.exports = (key, defaultValue = null) => {
  const envValue = process.env[key]
  return formatValue(envValue, defaultValue)
}
module.exports.formatValue = formatValue
