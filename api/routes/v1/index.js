var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.json({ message: "Todo API ROOT" });
});

router.use("/todos", require("./todos.js"));

module.exports = router;
