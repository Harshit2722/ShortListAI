const express = require("express");
const router = express.Router()

const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validation.middleware");
const {registerSchema,loginSchema} = require("../validators/auth.validator");

/**
 * @route POST /api/v1/auth/register
 * @description Register a new user
 * @access Public
 */
router.post("/register", validate(registerSchema), authController.register);

/**
 * @route POST /api/v1/auth/login
 * @description Login a user
 * @access Public
 */
router.post("/login", validate(loginSchema), authController.login);



module.exports = router;
