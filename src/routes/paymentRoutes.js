const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { protect } = require("../middlewares/auth");
const { paymentLimiter } = require("../middlewares/rateLimiter");

// Payment routes
router.post(
  "/intent",
  protect,
  paymentLimiter,
  paymentController.createPaymentIntent
);
router.post(
  "/confirm",
  protect,
  paymentLimiter,
  paymentController.confirmPayment
);

module.exports = router;
