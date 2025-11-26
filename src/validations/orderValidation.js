const Joi = require("joi");

// Create order validation
exports.createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    street: Joi.string().max(200).required().messages({
      "string.empty": "Street address is required",
      "string.max": "Street cannot exceed 200 characters",
    }),
    city: Joi.string().max(100).required().messages({
      "string.empty": "City is required",
      "string.max": "City cannot exceed 100 characters",
    }),
    state: Joi.string().max(100).required().messages({
      "string.empty": "State is required",
      "string.max": "State cannot exceed 100 characters",
    }),
    zipCode: Joi.string().max(20).required().messages({
      "string.empty": "Zip code is required",
      "string.max": "Zip code cannot exceed 20 characters",
    }),
    country: Joi.string().max(100).required().messages({
      "string.empty": "Country is required",
      "string.max": "Country cannot exceed 100 characters",
    }),
  }).required(),
  paymentMethod: Joi.string()
    .valid("credit_card", "debit_card", "upi", "net_banking", "cod")
    .optional()
    .default("credit_card")
    .messages({
      "any.only": "Invalid payment method",
    }),
});

// Get orders query validation
exports.getOrdersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(50).optional().default(10),
  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .optional(),
  paymentStatus: Joi.string()
    .valid("pending", "completed", "failed", "refunded")
    .optional(),
});

// Order ID validation (params)
exports.orderIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid order ID format",
    }),
});
