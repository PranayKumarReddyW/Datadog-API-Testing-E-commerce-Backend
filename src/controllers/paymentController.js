const { v4: uuidv4 } = require("uuid");
const Order = require("../models/Order");
const { asyncHandler } = require("../middlewares/errorHandler");

// @desc    Create payment intent (mock)
// @route   POST /api/payment/intent
// @access  Private
exports.createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;

  // Validate order exists
  const order = await Order.findOne({ orderId });
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // Check if order belongs to user
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to process payment for this order",
    });
  }

  // Random success/failure simulation
  const isSuccess = Math.random() > 0.2; // 80% success rate

  if (!isSuccess) {
    return res.status(400).json({
      success: false,
      message: "Payment processing failed. Please try again.",
    });
  }

  // Generate payment ID
  const paymentId = `PAY-${Date.now()}-${uuidv4().split("-")[0].toUpperCase()}`;

  res.status(200).json({
    success: true,
    message: "Payment intent created successfully",
    data: {
      paymentId,
      orderId,
      amount,
      status: "pending",
    },
  });
});

// @desc    Confirm payment (mock webhook)
// @route   POST /api/payment/confirm
// @access  Private
exports.confirmPayment = asyncHandler(async (req, res) => {
  const { paymentId, orderId } = req.body;

  // Validate order exists
  const order = await Order.findOne({ orderId });
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // Random success/failure simulation
  const isSuccess = Math.random() > 0.1; // 90% success rate

  if (!isSuccess) {
    order.paymentStatus = "failed";
    await order.save();

    return res.status(400).json({
      success: false,
      message: "Payment confirmation failed",
      data: {
        paymentId,
        orderId,
        status: "failed",
      },
    });
  }

  // Update order payment status
  order.paymentStatus = "completed";
  order.paymentId = paymentId;
  order.status = "processing";
  await order.save();

  res.status(200).json({
    success: true,
    message: "Payment confirmed successfully",
    data: {
      paymentId,
      orderId,
      status: "completed",
    },
  });
});
