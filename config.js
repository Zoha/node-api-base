const env = require("@utils/env")

module.exports = {
  nodeEnv: env("NODE_ENV", "development"),
  host: env("HOST", "localhost"),
  port: env("PORT", 3000),
  logErrors: env("LOG_ERRORS", true),
  accessOrigins: env("ACCESS_ORIGINS", "*"),
  socketPath: env("SOCKET_PATH", "/socket"),
  mongodbUriTest: env("MONGODB_URI_TEST", "mongodb://127.0.0.1:27017/baseTest"),
  mongodbUri: env("MONGODB_URI", "mongodb://127.0.0.1:27017/base"),
  redisPort: env("REDIS_PORT", 6379),
  redisHost: env("REDIS_HOST", "127.0.0.1"),
  redisPassword: env("REDIS_PASSWORD"),
  redisKeysPrefix: env("REDIS_KEYS_PREFIX", "app"),
  localizationLangs: env("LOCALIZATION_LANGS", ["en", "fa"]),
  localizationDefaultLang: env("LOCALIZATION_DEFAULT_LANG", "en"),
  localizationQueryParam: env("LOCALIZATION_QUERY_PARAM", "lang"),
  localizationUpdateFiles: env("LOCALIZATION_UPDATE_FILES", true),
  debugLevel: env("DEBUG_LEVEL", "info"),
  debugSaveFile: env("DEBUG_SAVE_FILE", false),
  debugSaveFileLevel: env("DEBUG_SAVE_FILE_LEVEL", "error")
}
