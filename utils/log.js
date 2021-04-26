const config = require("@config")
const winston = require("winston")
const { format } = winston
const path = require("path")
const chalk = require("chalk")
const moment = require("moment")
require("winston-daily-rotate-file")

const logColorWrappers = {
  verbose: chalk.grey,
  warning: chalk.yellow,
  error: chalk.redBright,
  info: chalk.blueBright
}

const logFormat = format.printf(info => {
  Error.stackTraceLimit = 50
  const traceString = new Error().stack
  Error.stackTraceLimit = 10
  const currentDir = path.join(__dirname, "../")
  const file = traceString
    ?.split("\n")
    .slice(1)
    .find(i => !i.includes("node_module") && !i.includes("log.js") && !i.includes("DerivedLogger"))
    .replace(currentDir, "")
    .replace(/.*\((.+)\).*/, "$1")
  const date = moment().format("YYYY-MM-DD HH:mm:ss.SSS")
  const title = info.level
  const colorWrap = logColorWrappers[info.level]
    ? text => logColorWrappers[info.level](text)
    : text => text

  return `${chalk.magentaBright(date)}  ${colorWrap(title)} : ${info.message} ${chalk.magentaBright(
    file
  )}`
})

const fileFormatter = format.printf(info => {
  Error.stackTraceLimit = 50
  const traceString = new Error().stack
  Error.stackTraceLimit = 10
  const currentDir = path.join(__dirname, "../")
  const file = traceString
    ?.split("\n")
    .slice(1)
    .find(i => !i.includes("node_module") && !i.includes("log.js") && !i.includes("DerivedLogger"))
    .replace(currentDir, "")
    .replace(/.*\((.+)\).*/, "$1")
  info.date = moment()
  info.file = file
  info.trace = traceString
    .split("\n")
    .slice(1, 21)
    .join("\n")
  return JSON.stringify(info)
})

const log = winston.createLogger({
  format: format.combine(format.splat()),
  transports: [
    ...(config.debugSaveFile
      ? [
          new winston.transports.DailyRotateFile({
            filename: "logs-%DATE%.log",
            datePattern: "YYYY-MM-DD-HH",
            dirname: path.join(__dirname, "../storage/logs/"),
            maxSize: "20m",
            maxFiles: "30d",
            level: config.debugSaveFileLevel,
            format: fileFormatter
          })
        ]
      : []),
    new winston.transports.Console({
      level: config.debugLevel,
      format: logFormat
    })
  ]
})

module.exports = log
