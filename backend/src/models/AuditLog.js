const { Schema, model } = require("mongoose");

// Append-only by convention: no update/delete routes are exposed for this
// collection anywhere in the API (see auditController.js — read-only).
const auditLogSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, default: null },
    oldValue: { type: Schema.Types.Mixed, default: null },
    newValue: { type: Schema.Types.Mixed, default: null },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

module.exports = model("AuditLog", auditLogSchema);
