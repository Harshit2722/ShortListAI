const express = require("express");
const router = express.Router();

const verifyJWT = require("../middlewares/auth.middleware");
const {authenticatedLimiter,emailLimiter,passwordLimiter,deleteAccountLimiter, publicLimiter} = require("../middlewares/rate.limitor");
const userController = require("../controllers/user.controller");
const validate = require("../middlewares/validation.middleware");
const {updateProfileSchema,requestEmailChangeSchema,verifyEmailChangeSchema,updatePasswordSchema,deleteUserSchema} = require("../validators/user.validator");
const avatarUpload = require("../middlewares/avatar.middleware");

/**
 * @route PATCH /api/v1/users/profile
 * @description Update current user profile
 * @access Private
 */
router.patch("/profile",verifyJWT, authenticatedLimiter, validate(updateProfileSchema),userController.updateProfile);

/**
 * @route PATCH /api/v1/users/request-email-change
 * @description Request to update the user's email
 * @access Private
 */
router.patch("/request-email-change",verifyJWT,emailLimiter,validate(requestEmailChangeSchema),userController.requestEmailChange)

/**
 * @route PATCH /api/v1/users/verify-email-change
 * @description Verify the user's email
 * @access Private
 */
router.patch("/verify-email-change",verifyJWT,emailLimiter,validate(verifyEmailChangeSchema),userController.verifyEmailChange)

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

/**
 * @route POST /api/v1/users/avatar
 * @description Upload/Update current user avatar
 * @access Private
 */
router.post("/avatar",verifyJWT,authenticatedLimiter,avatarUpload.single("avatar"),userController.uploadAvatar);

/**
 * @route DELETE /api/v1/users/avatar
 * @description Delete current user avatar
 * @access Private
 */
router.delete("/avatar",verifyJWT,authenticatedLimiter,userController.deleteAvatar);

module.exports = router;