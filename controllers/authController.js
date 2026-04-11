const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../middleware/auth");

async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(400, "Email and password are required."));
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });

    if (!user) {
      return next(createError(401, "Invalid credentials."));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(createError(401, "Invalid credentials."));
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, firstname: user.firstname, lastname: user.lastname },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({
      success: true,
      message: "Sign in successful.",
      data: {
        token,
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { signIn };
