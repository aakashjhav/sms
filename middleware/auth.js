const jwt = require("jsonwebtoken");
const env = require("dotenv/config");
module.exports = function (req, res, next) {
  //1. check if the token is present in request header
  const token = req.header("authorization");

  //2. return 400 error if no token
  if (!token) {
    return res.status(401).json({ msg: "no toke, authorization is denied" });
  }

  //3. verify token
  try {
    const payload = jwt.verify(token, process.env.SECRETKEY);
    req.student = payload;
    next(); //call API code
  } catch (error) {
    return res.status(401).json({ msg: "token is not valid" });
  }
};
