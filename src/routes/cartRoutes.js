const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require("../middlewares/auth");
const { validate, validateParams } = require("../middlewares/validate");
const {
  addToCartSchema,
  updateCartSchema,
  removeFromCartSchema,
} = require("../validations/cartValidation");
const { cartLimiter } = require("../middlewares/rateLimiter");

// Cart routes
router.post(
  "/add",
  protect,
  cartLimiter,
  validate(addToCartSchema),
  cartController.addToCart
);
router.get("/", protect, cartController.getCart);
router.put(
  "/update",
  protect,
  cartLimiter,
  validate(updateCartSchema),
  cartController.updateCart
);
router.delete(
  "/remove/:id",
  protect,
  validateParams(removeFromCartSchema),
  cartController.removeFromCart
);

module.exports = router;
