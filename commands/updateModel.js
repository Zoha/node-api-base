const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const pluralize = require("pluralize")
const ucfirst = require("ucfirst")
const mustache = require("mustache")
const formatCode = require("@utils/formatCode")

const getFieldTypeName = name => {
  if (name.includes("ObjectId")) {
    return `import("mongoose").Schema.Types.ObjectId`
  } else {
    return name
  }
}

const getModelData = async model => {
  model = pluralize.singular(model.toLowerCase())
  const Model = ucfirst(model)

  let schema
  const fields = {}
  let schemaFields = {}
  const customTypes = []

  const saveFieldsTypes = (field, target = fields) => {
    if (!field.creatable && !field.updatable) {
      return
    }
    if (!field.isNested) {
      target[field.nestedKey] = getFieldTypeName(field.type.name)
    } else if (field.isObjectNested) {
      target[field.nestedKey] = "object"
      for (const child of Object.values(field.children)) {
        saveFieldsTypes(child, target)
      }
    } else if (field.isArrayNested) {
      const typeProps = {}
      saveFieldsTypes(field.children[0], typeProps)
      if (Object.values(typeProps).length === 1) {
        target[field.nestedKey] = `Array.<${Object.values(typeProps)[0]}>`
      } else {
        for (const typePropKey in typeProps) {
          typeProps[typePropKey.slice(field.nestedKey.length + 3)] = typeProps[typePropKey]
          delete typeProps[typePropKey]
        }
        delete typeProps[""]
        customTypes.push(typeProps)
        target[field.nestedKey] = `Array.<customType${customTypes.length}>`
      }
    }
  }

  const schemasPath = path.join(__dirname, "../schemas")
  const schemaFilePath = path.join(schemasPath, `../schemas/${model}Schema.js`)
  if (fs.existsSync(schemasPath) && fs.existsSync(schemaFilePath)) {
    const relativePathToSchema = path.relative(__dirname, schemaFilePath)
    schema = require(relativePathToSchema)
  }
  if (schema) {
    const fields = await schema.tempContext.getFields()
    schemaFields = fields

    for (const index in fields) {
      const field = fields[index]
      saveFieldsTypes(field)
    }
  }

  const methods = fs
    .readdirSync(path.join(__dirname, `../models/${model}/methods`))
    .filter(i => i.endsWith(".js"))

  const statics = fs
    .readdirSync(path.join(__dirname, `../models/${model}/statics`))
    .filter(i => i.endsWith(".js"))

  // formatting

  const formatField = field => {
    let type = field.type?.name?.toString()
    if (type.includes("ObjectId")) {
      type = "ObjectId"
    }
    return {
      key: field.key,
      isArrayNested: field.isArrayNested,
      isObjectNested: field.isObjectNested,
      type,
      properties: Object.values(field.children).map(formatField),
      notNested: !field.isNested
    }
  }

  const internalFields = ["_id", "createdAt", "updatedAt"]

  return {
    model,
    Model,
    methods: methods.map(i => ({
      name: i.substr(0, i.length - path.extname(i).length)
    })),
    statics: statics.map(i => ({
      name: i.substr(0, i.length - path.extname(i).length)
    })),
    fields: Object.entries(fields).map(([key, type]) => ({
      key: key,
      type: type
    })),
    customTypes: customTypes.map((value, index) => ({
      name: `customType${Number(index) + 1}`,
      props: Object.entries(value).map(([key, type]) => ({
        key: key,
        type: type
      }))
    })),
    properties: Object.values(schemaFields)
      .filter(i => !!i.creatable || !!i.updatable)
      .filter(i => !internalFields.includes(i.key))
      .map(formatField),
    withoutFields: !Object.values(fields).length,
    withoutProperties: !Object.values(schemaFields).length,
    withoutMethods: !methods.length,
    withoutStatics: !statics.length,

    hasFields: !!Object.values(fields).length,
    hasProperties: !!Object.values(schemaFields).length,
    hasMethods: !!methods.length,
    hasStatics: !!statics.length
  }
}

const updateModel = async model => {
  model = pluralize.singular(model.toLowerCase())
  if (!fs.existsSync(path.join(__dirname, `../models/${model}.js`))) {
    console.info(chalk.red("model does not exist"))
    return
  }
  const data = await getModelData(model)
  const modelPropertiesFilePath = path.join(
    __dirname,
    "../models/",
    data.model,
    data.model + "ModelProperties.js"
  )
  const modelPropertiesTemplateFilePath = path.join(
    __dirname,
    "../assets/templates/modelProperties.mustache"
  )

  const modelTypeDefsFilePath = path.join(
    __dirname,
    "../models/",
    data.model,
    data.model + "TypeDefs.js"
  )
  const modelTypeDefsTemplatePath = path.join(
    __dirname,
    "../assets/templates/modelTypeDefs.mustache"
  )
  fs.writeFileSync(
    modelTypeDefsFilePath,
    await formatCode(mustache.render(fs.readFileSync(modelTypeDefsTemplatePath, "utf-8"), data))
  )
  fs.writeFileSync(
    modelPropertiesFilePath,
    await formatCode(
      mustache.render(fs.readFileSync(modelPropertiesTemplateFilePath, "utf-8"), data, {
        child: fs.readFileSync(
          path.join(__dirname, "../assets/templates/modelPropertiesPartial.mustache"),
          "utf-8"
        )
      })
    )
  )

  console.info(chalk.green(`${model} model updated`))
}

module.exports = {
  command: "update:model [model]",
  async action(model) {
    let models = [model]
    if (!model) {
      models = fs
        .readdirSync(path.join(__dirname, "../models"))
        .filter(i => i.endsWith(".js"))
        .map(i => i.slice(0, i.length - 3))
    }
    await Promise.all(models.map(model => updateModel(model)))
  }
}
