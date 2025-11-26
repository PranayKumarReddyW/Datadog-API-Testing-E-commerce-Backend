const Joi = require("joi");

// Update user profile validation
exports.updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().optional().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base":
        "Please provide a valid phone number (10-15 digits)",
    }),
  address: Joi.object({
    street: Joi.string().max(200).optional().allow(""),
    city: Joi.string().max(100).optional().allow(""),
    state: Joi.string().max(100).optional().allow(""),
    zipCode: Joi.string().max(20).optional().allow(""),
    country: Joi.string().max(100).optional().allow(""),
  }).optional(),
});

// Delete user validation (params)
exports.deleteUserSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid user ID format",
    }),
});
