const { Schema, model } = require("mongoose");

const transferSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    sourceLocation: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    destinationLocation: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    quantity: { type: Number, required: true, min: 1 },
    initiatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["PENDING", "IN_TRANSIT", "COMPLETED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = model("Transfer", transferSchema);
