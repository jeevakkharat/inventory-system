const express = require("express");
const { listUsers, getUser, createUser, updateUser } = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");

const router = express.Router();

// User management is Admin-only, per SRS 2.2.
router.use(authenticate, authorize("Admin"));

router.get("/", listUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);

module.exports = router;
