const express = require("express");

const { getDashboard } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Route
router.get("/", authMiddleware, getDashboard);

module.exports = router;