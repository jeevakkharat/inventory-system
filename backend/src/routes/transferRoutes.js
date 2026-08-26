const express = require("express");
const { createTransfer, listTransfers, updateTransferStatus } = require("../controllers/transferController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");
const { validate, transferSchema, transferStatusSchema } = require("../validators/schemas");

const router = express.Router();
const canManageTransfers = authorize("Admin", "Manager");

router.post("/", authenticate, canManageTransfers, validate(transferSchema), createTransfer);
router.get("/", authenticate, authorize("Admin", "Manager", "Auditor"), listTransfers);
router.put("/:id/status", authenticate, canManageTransfers, validate(transferStatusSchema), updateTransferStatus);

module.exports = router;
