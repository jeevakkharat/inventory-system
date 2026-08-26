const AuditLog = require('../models/AuditLog');

/**
 * Writes an append-only audit record. Pass `session` (a Mongoose client
 * session) so the audit entry commits atomically with the business change
 * it describes — e.g. inside the same transaction as a purchase or transfer.
 */
async function logAction({
  session = null,
  userId = null,
  action,
  entityType,
  entityId = null,
  oldValue = null,
  newValue = null,
  req = null,
}) {
  const [log] = await AuditLog.create(
    [
      {
        user: userId,
        action,
        entityType,
        entityId,
        oldValue,
        newValue,
        ipAddress: req?.ip,
        userAgent: req?.headers?.['user-agent'],
      },
    ],
    session ? { session } : {}
  );
  return log;
}

module.exports = { logAction };
