const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

module.exports = mongoose.model("User", userSchema);