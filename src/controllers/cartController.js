const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { asyncHandler } = require("../middlewares/errorHandler");

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Check stock availability
  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: `Insufficient stock. Only ${product.stock} items available`,
    });
  }

  // Find or create cart
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Update quantity
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  await cart.save();
  await cart.populate("items.product");

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    data: cart,
  });
});

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  res.status(200).json({
    success: true,
    data: cart,
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
exports.updateCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  // Find item in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Product not found in cart",
    });
  }

  // Validate product stock
  const product = await Product.findById(productId);
  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: `Insufficient stock. Only ${product.stock} items available`,
    });
  }

  // Update quantity
  cart.items[itemIndex].quantity = quantity;

  await cart.save();
  await cart.populate("items.product");

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: cart,
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:id
// @access  Private
exports.removeFromCart = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  // Filter out the item
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();
  await cart.populate("items.product");

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    data: cart,
  });
});
