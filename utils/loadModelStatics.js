const path = require("path")
const fs = require("fs")

module.exports = (schema, dirname, dirPath) => {
  const files = fs.readdirSync(path.join(dirname, dirPath))
  files.forEach(file => {
    const relativePath = path.relative(__dirname, path.join(dirname, dirPath, file))
    const fileName = file.replace(/\.js$/, "")
    schema.statics[fileName] = require(relativePath)
  })
}
