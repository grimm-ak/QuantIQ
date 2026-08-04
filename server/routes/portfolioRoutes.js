const express = require("express");

const {
    addStock,
    getPortfolio,
    updateHolding,
    deleteHolding,
} = require("../controllers/portfolioController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All portfolio routes require login
router.post("/", authMiddleware, addStock);
router.get("/", authMiddleware, getPortfolio);
router.put("/:id", authMiddleware, updateHolding);
router.delete("/:id", authMiddleware, deleteHolding);

module.exports = router;