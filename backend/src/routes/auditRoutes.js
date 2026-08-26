const express = require("express");
const { listAuditLogs } = require("../controllers/auditController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");

const router = express.Router();

router.get("/", authenticate, authorize("Admin", "Auditor"), listAuditLogs);

module.exports = router;
