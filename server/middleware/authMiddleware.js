const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  try {

    // Get authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    // Verify token
    const decoded = jwt.verify(token, "mysecretkey");

    console.log("DECODED:", decoded);

    req.user = decoded;

    next();

  } catch (error) {

    console.log(error);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;