const express = require("express");

const {
    addToWatchlist,
    getWatchlist,
    removeFromWatchlist,
} = require("../controllers/watchlistController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add stock to watchlist
router.post("/", authMiddleware, addToWatchlist);

// Get user's watchlist
router.get("/", authMiddleware, getWatchlist);

// Remove stock from watchlist
router.delete("/:symbol", authMiddleware, removeFromWatchlist);

module.exports = router;