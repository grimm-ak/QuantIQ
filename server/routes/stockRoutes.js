const express = require("express");

const {
    searchStock,
    getStockHistory,
    getStockAnalysis,
} = require("../controllers/stockController");

const router = express.Router();

router.get("/search/:symbol", searchStock);
router.get("/history/:symbol", getStockHistory);
router.get("/analysis/:symbol", getStockAnalysis);

module.exports = router;