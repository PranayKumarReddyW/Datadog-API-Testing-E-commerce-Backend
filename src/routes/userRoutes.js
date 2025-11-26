const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/auth");
const { validate, validateParams } = require("../middlewares/validate");
const {
  updateProfileSchema,
  deleteUserSchema,
} = require("../validations/userValidation");

// User routes
router.get("/me", protect, userController.getMe);
router.put(
  "/me",
  protect,
  validate(updateProfileSchema),
  userController.updateMe
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  validateParams(deleteUserSchema),
  userController.deleteUser
);

module.exports = router;
