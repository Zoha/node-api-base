const mustache = require("mustache")
const path = require("path")
const fs = require("fs")
const chalk = require("chalk")
const formatCode = require("@utils/formatCode")
const mkdirp = require("mkdirp")

module.exports = {
  command: "make:test <filePath>",
  async action(filePath) {
    // make test file path
    /** @type {string} */
    let testFilePath = filePath
    if (!testFilePath.endsWith(".test.js")) {
      testFilePath += ".test.js"
    }

    // create test file
    const testsDir = path.join(__dirname, "../tests")
    const fileName = testFilePath
      .split("/")
      .reverse()[0]
      .replace(/\.js$/, "")
    testFilePath = path.join(testsDir, testFilePath)
    const testFileTemplatePath = path.join(__dirname, "../assets/templates/testFile.mustache")

    if (fs.existsSync(testFilePath)) {
      console.info(chalk.red("test file already exists"))
      process.exit(0)
    }
    mkdirp.sync(path.dirname(testFilePath))
    fs.writeFileSync(
      testFilePath,
      await formatCode(
        mustache.render(fs.readFileSync(testFileTemplatePath, "utf-8"), { fileName })
      )
    )

    console.info(chalk.green("test file created successfully"))
    process.exit()
  }
}
