const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, "mysecretkey");

    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};