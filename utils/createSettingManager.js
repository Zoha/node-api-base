const redisKeys = require("@enums/redisKeys")
const redis = require("@utils/redis")

const convertTypeForApp = v => {
  if (v === "true") {
    return true
  } else if (v === "false") {
    return false
  } else if (/^[\d-.]+$/.test(v)) {
    return Number(v)
  } else if ((typeof v === "string" && v.startsWith("{")) || v.startsWith("[")) {
    try {
      return JSON.parse(v)
    } catch (e) {
      return v
    }
  }
  return v
}

const convertTypeForRedis = val => {
  if (Array.isArray(val)) {
    return JSON.stringify(val)
  } else if (typeof val === "object") {
    return JSON.stringify(val)
  } else if (val == null) {
    return null
  }
  return val
}

/**
 * @param {import('../constants/settings').defaultSettings} defaultSettings
 * @returns {import('../constants/settings').defaultSettings}
 */
const createSettingManager = defaultSettings => {
  const settingsKey = redis.createKey(redisKeys.settings)
  let currentValues = defaultSettings
  redis.hgetall(settingsKey).then(redisResult => {
    if (redisResult && Object.keys(redisResult).length) {
      const finalValues = {}
      const combinedValues = { ...currentValues, ...redisResult }
      for (const key in combinedValues) {
        if (!(key in redisResult)) {
          redis.hset(settingsKey, key, currentValues[key])
        } else if (!(key in currentValues)) {
          redis.hdel(settingsKey, key)
        }
        finalValues[key] = convertTypeForApp(combinedValues[key])
      }
      // @ts-ignore
      currentValues = finalValues
    } else {
      const data = []
      for (const key in currentValues) {
        data.push(key)
        data.push(convertTypeForRedis(currentValues[key]))
      }
      redis.hmset(settingsKey, ...data)
    }
  })
  const result = {}
  for (const key in defaultSettings) {
    Object.defineProperty(result, key, {
      get() {
        return currentValues[`${key}`]
      },
      set(val) {
        redis.hset(settingsKey, key, convertTypeForRedis(val))

        currentValues[`${key}`] = val
      }
    })
  }
  // @ts-ignore
  return result
}

module.exports = createSettingManager
