const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validate } = require("../middlewares/validate");
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} = require("../validations/authValidation");
const {
  loginLimiter,
  signupLimiter,
  passwordResetLimiter,
} = require("../middlewares/rateLimiter");

// Auth routes
router.post(
  "/signup",
  signupLimiter,
  validate(signupSchema),
  authController.signup
);
router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  authController.login
);
router.post("/logout", authController.logout);
router.post("/refresh", validate(refreshTokenSchema), authController.refresh);
router.post(
  "/forgot-password",
  passwordResetLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  passwordResetLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);

module.exports = router;
