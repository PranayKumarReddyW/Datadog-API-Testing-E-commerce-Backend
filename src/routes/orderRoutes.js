const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middlewares/auth");
const {
  validate,
  validateQuery,
  validateParams,
} = require("../middlewares/validate");
const {
  createOrderSchema,
  getOrdersQuerySchema,
  orderIdSchema,
} = require("../validations/orderValidation");

// Order routes
router.post(
  "/",
  protect,
  validate(createOrderSchema),
  orderController.createOrder
);
router.get(
  "/",
  protect,
  validateQuery(getOrdersQuerySchema),
  orderController.getOrders
);
router.get(
  "/:id",
  protect,
  validateParams(orderIdSchema),
  orderController.getOrder
);

module.exports = router;
