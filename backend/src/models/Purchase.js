const { Schema, model } = require("mongoose");

// Purchase line items are embedded rather than a separate collection —
// they only ever exist in the context of one purchase document.
const purchaseItemSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const purchaseSchema = new Schema(
  {
    supplierId: { type: String },
    purchaseDate: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["PENDING", "COMPLETED", "CANCELLED"], default: "PENDING" },
    items: { type: [purchaseItemSchema], required: true },
  },
  { timestamps: true }
);

module.exports = model("Purchase", purchaseSchema);
