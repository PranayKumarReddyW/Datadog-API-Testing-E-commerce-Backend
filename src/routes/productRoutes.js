const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, authorize, optionalAuth } = require("../middlewares/auth");
const {
  validate,
  validateQuery,
  validateParams,
} = require("../middlewares/validate");
const {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
  productIdSchema,
} = require("../validations/productValidation");

// Product routes
router.post(
  "/",
  protect,
  authorize("admin"),
  validate(createProductSchema),
  productController.createProduct
);
router.get(
  "/",
  optionalAuth,
  validateQuery(getProductsQuerySchema),
  productController.getProducts
);
router.get(
  "/:id",
  validateParams(productIdSchema),
  productController.getProduct
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validateParams(productIdSchema),
  validate(updateProductSchema),
  productController.updateProduct
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  validateParams(productIdSchema),
  productController.deleteProduct
);

module.exports = router;
