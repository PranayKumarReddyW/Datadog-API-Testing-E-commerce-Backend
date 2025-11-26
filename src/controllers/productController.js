const Product = require("../models/Product");
const { asyncHandler } = require("../middlewares/errorHandler");

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, imageUrl, brand } =
    req.body;

  // Check for duplicate product name
  const existingProduct = await Product.findOne({ name });
  if (existingProduct) {
    return res.status(400).json({
      success: false,
      message: "Product with this name already exists",
    });
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    imageUrl,
    brand,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

// @desc    Get all products with pagination, search, filters
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
    isActive,
  } = req.query;

  // Build query
  const query = {};

  // Search
  if (search) {
    query.$text = { $search: search };
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Active filter
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  // Execute query
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Check for duplicate name if name is being updated
  if (req.body.name && req.body.name !== product.name) {
    const existingProduct = await Product.findOne({ name: req.body.name });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists",
      });
    }
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
