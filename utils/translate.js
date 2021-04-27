const { I18n } = require("i18n")
const path = require("path")
const config = require("@config")

const translate = new I18n()

translate.configure({
  locales: config.localizationLangs,
  defaultLocale: config.localizationDefaultLang,
  retryInDefaultLocale: true,
  queryParameter: config.localizationQueryParam,
  directory: path.join(__dirname, "../assets/locales/"),
  updateFiles: config.localizationUpdateFiles,
  syncFiles: config.localizationUpdateFiles
})

module.exports = translate
