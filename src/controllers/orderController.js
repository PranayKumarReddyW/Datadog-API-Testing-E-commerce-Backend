const { v4: uuidv4 } = require("uuid");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { asyncHandler } = require("../middlewares/errorHandler");

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty",
    });
  }

  // Validate stock for all items
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${item.product.name}. Only ${item.product.stock} items available`,
      });
    }
  }

  // Prepare order items
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
  }));

  // Generate unique order ID
  const orderId = `ORD-${Date.now()}-${uuidv4().split("-")[0].toUpperCase()}`;

  // Create order
  const order = await Order.create({
    orderId,
    user: req.user._id,
    items: orderItems,
    totalAmount: cart.totalAmount,
    shippingAddress,
    paymentMethod,
  });

  // Reduce stock for each product
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  await order.populate("items.product");

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: {
      orderId: order.orderId,
      totalAmount: order.totalAmount,
      status: order.status,
      order,
    },
  });
});

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, paymentStatus } = req.query;

  // Build query
  const query = { user: req.user._id };

  if (status) {
    query.status = status;
  }

  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }

  // Execute query
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("items.product")
      .lean(),
    Order.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.product");

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // Check if order belongs to user (unless admin)
  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to view this order",
    });
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});
