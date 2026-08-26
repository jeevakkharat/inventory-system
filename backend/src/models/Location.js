const { Schema, model } = require("mongoose");

const locationSchema = new Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String },
  status: { type: String, default: "ACTIVE" },
});

module.exports = model("Location", locationSchema);
