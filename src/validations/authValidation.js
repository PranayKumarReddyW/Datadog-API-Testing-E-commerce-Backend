const Joi = require("joi");

// Signup validation
exports.signupSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
      )
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Please provide a valid phone number (10-15 digits)",
    }),
});

// Login validation
exports.loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

// Forgot password validation
exports.forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
});

// Reset password validation
exports.resetPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
    }),
  newPassword: Joi.string()
    .min(8)
    .max(128)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
      )
    )
    .required()
    .messages({
      "string.empty": "New password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});

// Refresh token validation
exports.refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "string.empty": "Refresh token is required",
  }),
});
