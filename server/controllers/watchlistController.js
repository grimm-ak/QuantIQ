const Watchlist = require("../models/Watchlist");
const Stock = require("../models/Stock");

// ================= ADD TO WATCHLIST =================

const addToWatchlist = async (req, res) => {
    try {
        const { symbol, companyName } = req.body;

        const existing = await Watchlist.findOne({
            user: req.user.id,
            symbol,
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Stock already exists in watchlist",
            });
        }

        const stock = await Watchlist.create({
            user: req.user.id,
            symbol,
            companyName,
        });

        res.status(201).json({
            success: true,
            message: "Added to watchlist",
            data: stock,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET WATCHLIST =================

const getWatchlist = async (req, res) => {
    try {
        const watchlist = await Watchlist.find({
            user: req.user.id,
        });

        const data = await Promise.all(
            watchlist.map(async (item) => {
                const stock = await Stock.findOne({
                    symbol: item.symbol,
                });

                return {
                    id: item._id,
                    symbol: item.symbol,
                    companyName: item.companyName,
                    currentPrice: stock?.currentPrice || 0,
                    marketCap: stock?.marketCap || 0,
                    peRatio: stock?.peRatio || 0,
                };
            })
        );

        res.json({
            success: true,
            watchlist: data,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= REMOVE FROM WATCHLIST =================

const removeFromWatchlist = async (req, res) => {
    try {
        const stock = await Watchlist.findOne({
            user: req.user.id,
            symbol: req.params.symbol.toUpperCase(),
        });

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: "Stock not found",
            });
        }

        await stock.deleteOne();

        res.json({
            success: true,
            message: "Removed from watchlist",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    addToWatchlist,
    getWatchlist,
    removeFromWatchlist,
};