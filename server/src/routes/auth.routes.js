const express = require("express");
const router = express.Router()

const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validation.middleware");
const {registerSchema,loginSchema,verifyEmailSchema,resendOtpSchema,forgotPasswordSchema,resetPasswordSchema} = require("../validators/auth.validator");
const verifyJWT = require("../middlewares/auth.middleware");
const {publicLimiter, refreshLimiter,authenticatedLimiter} = require("../middlewares/rate.limitor");

/**
 * @route POST /api/v1/auth/register
 * @description Register a new user
 * @access Public
 */
router.post("/register", publicLimiter, validate(registerSchema), authController.register);

/**
 * @route POST /api/v1/auth/verify-email
 * @description Verify OTP sent to email
 * @access Public
 */
router.post("/verify-email", publicLimiter, validate(verifyEmailSchema), authController.verifyEmail);

/**
 * @route POST /api/v1/auth/forgot-password
 * @description Send OTP to email for password reset
 * @access Public
 */
router.post("/forgot-password", publicLimiter, validate(forgotPasswordSchema), authController.forgotPassword);

/**
 * @route POST /api/v1/auth/reset-password
 * @description Reset password using OTP
 * @access Public
 */
router.post("/reset-password", publicLimiter, validate(resetPasswordSchema), authController.resetPassword);

/**
 * @route POST /api/v1/auth/resend-otp
 * @description Resend OTP to email
 * @access Public
 */
router.post("/resend-otp", publicLimiter, validate(resendOtpSchema), authController.resendOTP);

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
