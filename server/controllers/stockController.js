const Stock = require("../models/Stock");
const { getStockData } = require("../services/yahooService");

const searchStock = async (req, res) => {
    try {
        // Normalize symbol
        const symbol = req.params.symbol.toUpperCase();

        // Check MongoDB cache
        const cachedStock = await Stock.findOne({ symbol });

        if (cachedStock) {
            return res.status(200).json({
                success: true,
                source: "MongoDB Cache",
                data: cachedStock,
            });
        }

        // Fetch from Yahoo Finance
        const stock = await getStockData(symbol);

        // Save (or update) in MongoDB
        const savedStock = await Stock.findOneAndUpdate(
            { symbol: stock.symbol },
            stock,
            {
                new: true,
                upsert: true,
            }
        );

        res.status(200).json({
            success: true,
            source: "Yahoo Finance",
            data: savedStock,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    searchStock,
};