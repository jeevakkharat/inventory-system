const express = require("express");
const { register, login, me } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { validate, registerSchema, loginSchema } = require("../validators/schemas");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, me);

module.exports = router;
