const config = require("@config")
const environments = require("@enums/environments")
const Redis = require("ioredis")
const RedisMock = require("ioredis-mock")

let redis
if (config.nodeEnv === environments.test) {
  redis = new RedisMock({})
} else {
  redis = new Redis({
    port: config.redisPort,
    host: config.redisHost,
    ...(config.redisPassword ? { password: config.redisPassword } : {})
  })
}

module.exports = redis

/**
 *
 * @param {string} type
 * @param {string} [id]
 * @returns {string}
 */
module.exports.createKey = (type, id = null) => {
  return `${config.redisKeysPrefix}-${type}${id ? `-${id}` : ""}`
}
