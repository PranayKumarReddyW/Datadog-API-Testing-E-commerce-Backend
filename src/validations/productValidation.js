const Joi = require("joi");

// Create product validation
exports.createProductSchema = Joi.object({
  name: Joi.string().min(3).max(200).trim().required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 3 characters long",
    "string.max": "Product name cannot exceed 200 characters",
  }),
  description: Joi.string().min(10).max(2000).trim().required().messages({
    "string.empty": "Product description is required",
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 2000 characters",
  }),
  price: Joi.number().min(0).precision(2).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),
  category: Joi.string()
    .valid(
      "Electronics",
      "Clothing",
      "Books",
      "Home & Kitchen",
      "Sports",
      "Toys",
      "Beauty",
      "Automotive",
      "Food & Beverages",
      "Health",
      "Other"
    )
    .required()
    .messages({
      "any.only": "Invalid category",
      "any.required": "Category is required",
    }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock cannot be negative",
    "any.required": "Stock is required",
  }),
  imageUrl: Joi.string()
    .uri()
    .pattern(/\.(jpg|jpeg|png|gif|webp)$/i)
    .optional()
    .allow("")
    .messages({
      "string.uri": "Please provide a valid URL",
      "string.pattern.base":
        "Image URL must end with .jpg, .jpeg, .png, .gif, or .webp",
    }),
  brand: Joi.string().max(100).optional().allow("").messages({
    "string.max": "Brand name cannot exceed 100 characters",
  }),
});

// Update product validation
exports.updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(200).trim().optional().messages({
    "string.min": "Product name must be at least 3 characters long",
    "string.max": "Product name cannot exceed 200 characters",
  }),
  description: Joi.string().min(10).max(2000).trim().optional().messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 2000 characters",
  }),
  price: Joi.number().min(0).precision(2).optional().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
  }),
  category: Joi.string()
    .valid(
      "Electronics",
      "Clothing",
      "Books",
      "Home & Kitchen",
      "Sports",
      "Toys",
      "Beauty",
      "Automotive",
      "Food & Beverages",
      "Health",
      "Other"
    )
    .optional()
    .messages({
      "any.only": "Invalid category",
    }),
  stock: Joi.number().integer().min(0).optional().messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock cannot be negative",
  }),
  imageUrl: Joi.string()
    .uri()
    .pattern(/\.(jpg|jpeg|png|gif|webp)$/i)
    .optional()
    .allow("")
    .messages({
      "string.uri": "Please provide a valid URL",
      "string.pattern.base":
        "Image URL must end with .jpg, .jpeg, .png, .gif, or .webp",
    }),
  brand: Joi.string().max(100).optional().allow("").messages({
    "string.max": "Brand name cannot exceed 100 characters",
  }),
  isActive: Joi.boolean().optional(),
});

// Get products query validation
exports.getProductsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  search: Joi.string().max(200).optional().allow(""),
  category: Joi.string().optional().allow(""),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  sortBy: Joi.string()
    .valid("name", "price", "createdAt", "ratings.average")
    .optional()
    .default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").optional().default("desc"),
  isActive: Joi.boolean().optional(),
});

// Product ID validation (params)
exports.productIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid product ID format",
    }),
});
