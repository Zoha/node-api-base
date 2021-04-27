const translate = require("@utils/translate")

module.exports = app => {
  app.use(translate.init)
}
