require("module-alias/register")
const { program } = require("commander")
const loadFilesIn = require("@utils/loadFilesIn")

program.version("1.0.0")

const commandFiles = loadFilesIn(__dirname, "commands")

Object.values(commandFiles).forEach(commandFile => {
  const command = program.command(commandFile.command)
  if (commandFile.options) {
    commandFile.options.forEach(option => {
      command.option(option)
    })
  }
  command.action(commandFile.action)
})

program.parse(process.argv)
