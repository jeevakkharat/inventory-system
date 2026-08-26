const express = require("express");
const { listItems, getItem, createItem, updateItem } = require("../controllers/itemController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");
const { validate, itemSchema, itemUpdateSchema } = require("../validators/schemas");

const router = express.Router();

const canManageInventory = authorize("Admin", "Manager", "Inventory Manager");

router.get("/", authenticate, listItems);
router.get("/:id", authenticate, getItem);
router.post("/", authenticate, canManageInventory, validate(itemSchema), createItem);
router.put("/:id", authenticate, canManageInventory, validate(itemUpdateSchema), updateItem);

module.exports = router;
