const express = require("express");
const { createAssignment, listAssignments, returnAssignment } = require("../controllers/assignmentController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");
const { validate, assignmentSchema } = require("../validators/schemas");

const router = express.Router();
const canManageAssignments = authorize("Admin", "Manager");

router.post("/", authenticate, canManageAssignments, validate(assignmentSchema), createAssignment);
router.get("/", authenticate, listAssignments);
router.put("/:id/return", authenticate, canManageAssignments, returnAssignment);

module.exports = router;
