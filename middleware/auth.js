const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_production";

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return next(createError(401, "Authentication token is required."));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return next(createError(401, "Invalid or expired authentication token."));
  }
}

module.exports = { requireAuth, JWT_SECRET };
