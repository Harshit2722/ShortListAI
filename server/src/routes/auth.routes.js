const express = require("express");
const router = express.Router()

const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validation.middleware");
const {registerSchema,loginSchema} = require("../validators/auth.validator");
const verifyJWT = require("../middlewares/auth.middleware");
const {publicLimiter, refreshLimiter,authenticatedLimiter} = require("../middlewares/rate.limitor");

/**
 * @route POST /api/v1/auth/register
 * @description Register a new user
 * @access Public
 */
router.post("/register", publicLimiter, validate(registerSchema), authController.register);

/**
 * @route POST /api/v1/auth/login
 * @description Login a user
 * @access Public
 */
router.post("/login", publicLimiter, validate(loginSchema), authController.login);

/**
 * @route POST /api/v1/auth/logout
 * @description Logout a user
 * @access Private  
 */
router.post("/logout", verifyJWT, authenticatedLimiter, authController.logout);

/**
 * @route POST /api/v1/auth/refresh
 * @description Refresh access token
 * @access Public
 */
router.post("/refresh", refreshLimiter,authController.refreshAccessToken);

module.exports = router;
