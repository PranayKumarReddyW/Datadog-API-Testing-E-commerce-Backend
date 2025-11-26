const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");

// Error testing routes
router.get("/500", errorController.error500);
router.get("/slow", errorController.slowResponse);
router.get("/random", errorController.randomResponse);

module.exports = router;
