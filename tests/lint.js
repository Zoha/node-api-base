const glob = require("glob")
const { CLIEngine } = require("eslint")
const path = require("path")

const paths = glob.sync(path.join(__dirname, "../") + "**/*.js", {
  ignore: [
    path.join(__dirname, "../node_modules/**/*"),
    path.join(__dirname, "../tests/**/*"),
    path.join(__dirname, "../.eslintrc.js")
  ]
})
const engine = new CLIEngine({
  envs: ["node", "mocha"],
  useEslintrc: true
})
const results = engine.executeOnFiles(paths).results

describe("ESLint", function() {
  this.timeout(8000)

  results.forEach(result => {
    const { messages, filePath } = result
    it(filePath, () => {
      const finalMessages = []
      if (messages.length > 0) {
        messages.forEach(message => {
          finalMessages.push(
            `${filePath}:${message.line}:${message.column} ${message.message.slice(0, -1)} - ${
              message.ruleId
            }\n`
          )
        })
      }
      if (finalMessages.length > 0) {
        throw new Error("there was errors \n" + finalMessages.join("\n"))
      }
    })
  })
})
