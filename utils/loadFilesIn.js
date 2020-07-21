const path = require("path")
const fs = require("fs")

module.exports = (dirname, targetPath, { ignoreFiles = [] } = {}) => {
  const files = fs.readdirSync(path.join(dirname, targetPath))
  const result = {}
  files.forEach(file => {
    if (ignoreFiles.find(i => file.includes(i))) {
      return
    }
    if (!/\..{2,4}/.test(file)) {
      return
    }
    result[file] = require("./" +
      path
        .relative(__dirname, path.join(dirname, targetPath, file.replace(/\.js$/, "")))
        .replace(/\\/g, "/"))
  })
  return result
}
