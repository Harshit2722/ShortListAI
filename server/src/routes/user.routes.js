const express = require("express");
const router = express.Router();

const verifyJWT = require("../middlewares/auth.middleware");
const {authenticatedLimiter,emailLimiter,passwordLimiter,deleteAccountLimiter} = require("../middlewares/rate.limitor");
const userController = require("../controllers/user.controller");
const validate = require("../middlewares/validation.middleware");
const {updateProfileSchema,updateEmailSchema,updatePasswordSchema,deleteUserSchema} = require("../validators/user.validator");

/**
 * @route PATCH /api/v1/users/profile
 * @description Update current user profile
 * @access Private
 */
router.patch("/profile",verifyJWT, authenticatedLimiter, validate(updateProfileSchema),userController.updateProfile);

/**
 * @route PATCH /api/v1/users/email
 * @description Update current user email
 * @access Private
 */
router.patch("/email",verifyJWT,emailLimiter,validate(updateEmailSchema),userController.updateEmail)

/**
 * @route PATCH /api/v1/users/password
 * @description Update current user password
 * @access Private
 */
router.patch("/password",verifyJWT,passwordLimiter,validate(updatePasswordSchema),userController.updatePassword)

/**
 * @route GET /api/v1/users/me
 * @description Get current user info
 * @access Private
 */
router.get("/me",verifyJWT,authenticatedLimiter,userController.getCurrentUser);

/**
 * @route DELETE /api/v1/users/
 * @description Delete current user account
 * @access Private
 */
router.delete("/",verifyJWT,deleteAccountLimiter,validate(deleteUserSchema),userController.deleteUser);

module.exports = router;