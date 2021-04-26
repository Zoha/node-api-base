const pluralize = require("pluralize")
const ucfirst = require("ucfirst")
const formatCode = require("@utils/formatCode")
const path = require("path")
const fs = require("fs")
const chalk = require("chalk")
const mustache = require("mustache")
const { spawnSync: execCommand } = require("child_process")
const inquirer = require("inquirer")

module.exports = {
  command: "make:schema <name> [fileName]",
  async action(name, fileName) {
    fileName = fileName || name
    const schema = pluralize.singular(name)
    const Schema = ucfirst(schema)

    const schemasDirectory = path.join(__dirname, "../schemas/")

    if (!fs.existsSync(schemasDirectory)) {
      fs.mkdirSync(schemasDirectory)
    }

    const schemaTemplateFilePath = path.join(
      __dirname,
      "../assets/templates/mustache/",
      `schema.mustache`
    )
    const schemaFilePath = path.join(schemasDirectory, `${fileName}Schema.js`)

    // check that schema file already exists or not
    if (fs.existsSync(schemaFilePath)) {
      return console.info(chalk.red("schema file already exists"))
    }

    // check that model exists or not
    // if not create model
    const modelFilePath = path.join(__dirname, "../models/", Schema + ".js")
    if (!fs.existsSync(modelFilePath)) {
      const commandFilePath = path.join(__dirname, "../command.js")
      const command = `${commandFilePath} make:model ${schema}`
      console.info(execCommand("node", command.split(" ")).stderr.toString())
    }

    const data = {
      schema,
      Schema,
      fileName
    }

    // create model file
    fs.writeFileSync(
      schemaFilePath,
      await formatCode(mustache.render(fs.readFileSync(schemaTemplateFilePath, "utf-8"), data))
    )

    // create route file if does not exist (confirm first)
    const routerFileDir = path.join(__dirname, `../routes/${pluralize(schema)}`)
    const routerFileIndex = path.join(routerFileDir, "index.js")
    const routerFileRest = path.join(routerFileDir, "rest.js")
    if (!fs.existsSync(routerFileRest)) {
      const result = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: "do you want to create route file"
        }
      ])

      if (result.confirm) {
        const schemaIndexFilePath = path.join(
          __dirname,
          "../assets/templates/mustache/",
          `restSchemaIndexFile.mustache`
        )
        const schemaRestFilePath = path.join(
          __dirname,
          "../assets/templates/mustache/",
          `restSchemaRestFile.mustache`
        )

        if (!fs.existsSync(routerFileDir)) {
          fs.mkdirSync(routerFileDir)
        }
        if (!fs.existsSync(routerFileIndex)) {
          fs.writeFileSync(
            routerFileIndex,
            await formatCode(mustache.render(fs.readFileSync(schemaIndexFilePath, "utf-8"), data))
          )
        } else {
          const routerIndex = fs.readFileSync(routerFileIndex, "utf-8")
          const newRouterIndexContent = routerIndex.replace(
            /module.exports\s=\srouter/,
            `router.use(require("./rest"))\n\nmodule.exports = router`
          )

          fs.writeFileSync(routerFileIndex, await formatCode(newRouterIndexContent))
        }
        fs.writeFileSync(
          routerFileRest,
          await formatCode(mustache.render(fs.readFileSync(schemaRestFilePath, "utf-8"), data))
        )

        const routerIndexFilePath = path.join(__dirname, "../routes/index.js")
        const routerIndex = fs.readFileSync(routerIndexFilePath, "utf-8")
        const newRouterIndexContent = routerIndex.replace(
          /\/\/\s?fallback\sroute/,
          `// ${schema} routes\nrouter.use("/${pluralize(schema)}", require("./${pluralize(
            schema
          )}"))\n\n// fallback route`
        )

        fs.writeFileSync(routerIndexFilePath, await formatCode(newRouterIndexContent))
      }
    }

    console.info(chalk.green(schema + " schema file created"))
    process.exit()
  }
}
