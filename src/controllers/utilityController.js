const mongoose = require("mongoose");
const { asyncHandler } = require("../middlewares/errorHandler");

// @desc    Health check
// @route   GET /api/health
// @access  Public
exports.healthCheck = asyncHandler(async (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  res.status(200).json({
    success: true,
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV || "development",
  });
});

// @desc    Get API version
// @route   GET /api/version
// @access  Public
exports.getVersion = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    version: process.env.API_VERSION || "1.0.0",
    buildDate: process.env.BUILD_DATE || "2025-11-26",
    nodeVersion: process.version,
  });
});
