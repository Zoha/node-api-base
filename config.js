const env = require("@utils/env")

module.exports = {
  nodeEnv: env("NODE_ENV", "development"),
  host: env("HOST", "localhost"),
  port: env("PORT", 3000),
  logErrors: env("LOG_ERRORS", true),
  accessOrigins: env("ACCESS_ORIGINS", "*"),
  socketPath: env("SOCKET_PATH", "/socket"),
  mongodbUriTest: env("MONGODB_URI_TEST", "mongodb://127.0.0.1:27017/baseTest"),
  mongodbUri: env("MONGODB_URI", "mongodb://127.0.0.1:27017/base")
}
