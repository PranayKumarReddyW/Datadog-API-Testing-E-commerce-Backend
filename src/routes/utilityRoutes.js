const express = require("express");
const router = express.Router();
const utilityController = require("../controllers/utilityController");

// Utility routes
router.get("/health", utilityController.healthCheck);
router.get("/version", utilityController.getVersion);

module.exports = router;
