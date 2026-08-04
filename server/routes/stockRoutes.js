const express = require("express");

const {
    searchStock,
    getStockHistory,
    getStockAnalysis,
    getAIAnalysis,
    compareStocks,
} = require("../controllers/stockController");

const router = express.Router();

router.get("/search/:symbol", searchStock);
router.get("/history/:symbol", getStockHistory);
router.get("/analysis/:symbol", getStockAnalysis);
router.get("/compare", compareStocks);
router.get("/ai-analysis/:symbol", getAIAnalysis);

module.exports = router;