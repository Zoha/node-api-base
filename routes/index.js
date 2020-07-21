const router = require("express").Router()

router.get("/", (req, res) => {
  res.send({
    message: "app is running"
  })
})

// loading app routes
// all app general routes should be loaded
// in below lines

// fallback route
router.use(require("./fallback"))

// error handler
router.use(require("./errorHandler"))

module.exports = router
