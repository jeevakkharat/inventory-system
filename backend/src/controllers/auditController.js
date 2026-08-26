const AuditLog = require('../models/AuditLog');
const { asyncHandler } = require('../utils/apiError');

// GET /api/audit-logs?entityType=&userId=
const listAuditLogs = asyncHandler(async (req, res) => {
  const { entityType, userId } = req.query;

  const filter = {};
  if (entityType) filter.entityType = entityType;
  if (userId) filter.user = userId;

  const logs = await AuditLog.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(200);

  res.json({ success: true, data: logs });
});

module.exports = { listAuditLogs };
