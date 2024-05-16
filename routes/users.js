var express = require("express");
var router = express.Router();
const env = require("dotenv/config");
/* GET users listing. */
router.get("/users", function (req, res, next) {
  res.send("respond with a resource" + process.env.DATABASE_TYPE);
});

module.exports = router;
