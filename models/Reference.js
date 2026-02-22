const mongoose = require("mongoose");

const referenceSchema = new mongoose.Schema(
  {
    firstname: { type: String},
    lastname: { type: String},
    email: { type: String},
    position: { type: String},
    company: { type: String}
  },
  { timestamps: false }
);

module.exports = mongoose.model("Reference", referenceSchema);