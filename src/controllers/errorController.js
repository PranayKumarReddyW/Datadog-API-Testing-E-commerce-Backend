const { asyncHandler } = require("../middlewares/errorHandler");

// @desc    Always returns 500 error
// @route   GET /api/error/500
// @access  Public
exports.error500 = asyncHandler(async (req, res) => {
  throw new Error("Intentional 500 error for testing");
});

// @desc    Slow response (5 seconds)
// @route   GET /api/error/slow
// @access  Public
exports.slowResponse = asyncHandler(async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  res.status(200).json({
    success: true,
    message: "Slow response completed after 5 seconds",
  });
});

// @desc    Random response (200/400/500)
// @route   GET /api/error/random
// @access  Public
exports.randomResponse = asyncHandler(async (req, res) => {
  const random = Math.random();

  if (random < 0.33) {
    // 33% - Success
    return res.status(200).json({
      success: true,
      message: "Random response: Success",
    });
  } else if (random < 0.66) {
    // 33% - Client error
    return res.status(400).json({
      success: false,
      message: "Random response: Bad Request",
    });
  } else {
    // 34% - Server error
    throw new Error("Random response: Internal Server Error");
  }
});
