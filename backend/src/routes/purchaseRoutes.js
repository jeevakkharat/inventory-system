const express = require("express");
const { createPurchase, listPurchases, getPurchase } = require("../controllers/purchaseController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");
const { validate, purchaseSchema } = require("../validators/schemas");

const router = express.Router();
const canManagePurchases = authorize("Admin", "Manager");

router.post("/", authenticate, canManagePurchases, validate(purchaseSchema), createPurchase);
router.get("/", authenticate, authorize("Admin", "Manager", "Auditor"), listPurchases);
router.get("/:id", authenticate, authorize("Admin", "Manager", "Auditor"), getPurchase);

module.exports = router;
