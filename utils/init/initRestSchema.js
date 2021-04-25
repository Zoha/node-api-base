const loadFilesIn = require("@utils/loadFilesIn")

// load all schemas
loadFilesIn(__dirname, "../../schemas", { optional: true })
