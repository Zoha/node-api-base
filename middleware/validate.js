const { validationResult, body, check, param, query } = require("express-validator")
const ValidatorJs = require("validatorjs")

const getLocaleMessage = message => {
  // we can change this for locale messages
  return message
}

const expressValidatorHandler = validations => {
  return [
    validations,
    (req, res, next) => {
      // validation check
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorsList = []
        for (const error of errors.array()) {
          errorsList.push([
            {
              field: error.param,
              message: getLocaleMessage(error.msg || `${error.param} is invalid`),
              value: error.value,
              location: error.location || "body"
            }
          ])
        }
        return res.status(422).json(errorsList)
      }
      next()
    }
  ]
}

const validatorJsHandler = validations => {
  return (req, res, next) => {
    const validationResult = new ValidatorJs(
      {
        ...req.query,
        ...(req.body || {}),
        ...req.params
      },
      validations
    )
    if (validationResult.passes()) {
      return next()
    } else {
      const errors = []
      const validationErrors = Object.entries(validationResult.errors.all())
      for (const [fieldKey, fieldErrors] of validationErrors) {
        for (const error of fieldErrors) {
          errors.push({
            field: fieldKey,
            message: getLocaleMessage(error)
          })
        }
      }
      return res.status(422).json(errors)
    }
  }
}

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {Array.<import("express-validator").ValidationChain>} validationsList
 * @typedef {import("validatorjs").Rules} validationsObject
 *
 * @param {validationsList | validationsObject} validations
 * @returns { RequestHandler | RequestHandler[]}
 */
const validate = validations => {
  if (Array.isArray(validations)) {
    return expressValidatorHandler(validations)
  } else if (typeof validations == "object") {
    return validatorJsHandler(validations)
  }
  throw new Error("validations input are invalid")
}

validate.body = body
validate.check = check
validate.parma = param
validate.query = query
validate.validate = validate

module.exports = validate
