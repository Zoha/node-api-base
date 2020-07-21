const mongoose = require("mongoose")
const config = require("@config")
const environments = require("@enums/environments")

mongoose.Promise = global.Promise
mongoose.set("useCreateIndex", true)
mongoose.set("useFindAndModify", false)

const connectionUri =
  config.nodeEnv == environments.test ? config.mongodbUriTest : config.mongodbUri

mongoose.connect(connectionUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

module.exports = mongoose
