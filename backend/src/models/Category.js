const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String },
});

module.exports = model("Category", categorySchema);
