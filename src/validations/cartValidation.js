const Joi = require("joi");

// Add to cart validation
exports.addToCartSchema = Joi.object({
  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid product ID format",
      "any.required": "Product ID is required",
    }),
  quantity: Joi.number().integer().min(1).max(100).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
    "number.max": "Quantity cannot exceed 100",
    "any.required": "Quantity is required",
  }),
});

// Update cart validation
exports.updateCartSchema = Joi.object({
  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid product ID format",
      "any.required": "Product ID is required",
    }),
  quantity: Joi.number().integer().min(1).max(100).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
    "number.max": "Quantity cannot exceed 100",
    "any.required": "Quantity is required",
  }),
});

// Remove from cart validation (params)
exports.removeFromCartSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid product ID format",
    }),
});
