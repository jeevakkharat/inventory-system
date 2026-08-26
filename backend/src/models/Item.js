const { Schema, model } = require("mongoose");

const itemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true }
);

module.exports = model("Item", itemSchema);
