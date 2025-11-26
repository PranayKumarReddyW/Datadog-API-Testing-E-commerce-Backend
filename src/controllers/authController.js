const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const OTP = require("../models/OTP");
const { asyncHandler } = require("../middlewares/errorHandler");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User with this email already exists",
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      userId: user._id,
      email: user.email,
      name: user.name,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: "Account is deactivated. Please contact support.",
    });
  }

  // Verify password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken,
    },
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    // Revoke refresh token
    await RefreshToken.updateOne({ token: refreshToken }, { isRevoked: true });
  }

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  // Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }

  // Check if token exists and is not revoked
  const storedToken = await RefreshToken.findOne({
    token: refreshToken,
    isRevoked: false,
  });

  if (!storedToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token not found or has been revoked",
    });
  }

  // Check if token is expired
  if (new Date() > storedToken.expiresAt) {
    return res.status(401).json({
      success: false,
      message: "Refresh token has expired",
    });
  }

  // Generate new access token
  const newToken = generateToken(decoded.id);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      token: newToken,
    },
  });
});

// @desc    Request password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists or not for security
    return res.status(200).json({
      success: true,
      message: "If the email exists, an OTP has been sent",
    });
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Store OTP
  const expiresAt = new Date(
    Date.now() + (parseInt(process.env.OTP_EXPIRES_IN) || 600000)
  );

  await OTP.create({
    email,
    otp,
    expiresAt,
  });

  // In production, send OTP via email
  console.log(`OTP for ${email}: ${otp}`);

  res.status(200).json({
    success: true,
    message: "OTP sent to email successfully",
    // Remove this in production
    ...(process.env.NODE_ENV === "development" && { otp }),
  });
});

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Find valid OTP
  const otpRecord = await OTP.findOne({
    email,
    otp,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    // Increment attempts if OTP exists
    await OTP.updateOne({ email, otp }, { $inc: { attempts: 1 } });

    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }

  // Check attempts
  if (otpRecord.attempts >= 5) {
    return res.status(400).json({
      success: false,
      message: "Too many attempts. Please request a new OTP.",
    });
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Mark OTP as used
  otpRecord.isUsed = true;
  await otpRecord.save();

  // Revoke all refresh tokens for this user
  await RefreshToken.updateMany({ user: user._id }, { isRevoked: true });

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});
