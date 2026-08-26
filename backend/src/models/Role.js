const { Schema, model } = require("mongoose");

// Admin, Manager, Inventory Manager, Employee, Auditor
const roleSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String },
});

module.exports = model("Role", roleSchema);
