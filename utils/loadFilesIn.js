const path = require("path")
const fs = require("fs")
const chalk = require("chalk")

module.exports = (dirname, targetPath, { ignoreFiles = [], optional = false, data = [] } = {}) => {
  if (!fs.existsSync(path.join(dirname, targetPath))) {
    if (optional) {
      return
    }
    console.info(chalk.red(targetPath + "does not exist"))
  }
  const files = fs.readdirSync(path.join(dirname, targetPath))
  const result = {}
  files.forEach(file => {
    if (ignoreFiles.find(i => file.includes(i))) {
      return
    }
    if (!/\..{2,4}/.test(file)) {
      return
    }
    const thisFileResult = require("./" +
      path
        .relative(__dirname, path.join(dirname, targetPath, file.replace(/\.js$/, "")))
        .replace(/\\/g, "/"))
    if (typeof thisFileResult === "function") {
      result[file] = thisFileResult(...data)
    } else {
      result[file] = thisFileResult
    }
  })
  return result
}
