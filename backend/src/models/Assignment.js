const { Schema, model } = require("mongoose");

const assignmentSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedAt: { type: Date, default: Date.now },
    returnedAt: { type: Date, default: null },
    status: { type: String, enum: ["ASSIGNED", "RETURNED"], default: "ASSIGNED" },
  },
  { timestamps: true }
);

module.exports = model("Assignment", assignmentSchema);
