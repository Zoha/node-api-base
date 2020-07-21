const prettier = require("prettier")
const path = require("path")

module.exports = text =>
  prettier.resolveConfig(path.join(__dirname, "../.prettierrc.json")).then(options => {
    return prettier.format(text, { parser: "babel", ...options })
  })
