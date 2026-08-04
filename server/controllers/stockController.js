const Stock = require("../models/Stock");
const { getCompleteStockData } = require("../services/stockAggregator");
const { getHistoricalData } = require("../services/yahooService");

const {
    calculateSMA,
    calculateEMA,
    calculateRSI,
    calculateMACD,
} = require("../services/indicatorService");

// ================= SEARCH STOCK =================

const searchStock = async (req, res) => {
    try {
        const symbol = req.params.symbol.toUpperCase();

        // Check MongoDB Cache
        const cachedStock = await Stock.findOne({ symbol });

        if (cachedStock) {
            return res.status(200).json({
                success: true,
                source: "MongoDB Cache",
                data: cachedStock,
            });
        }

        // Fetch latest stock data
        const stock = await getCompleteStockData(symbol);

        // Save to MongoDB
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

// ================= STOCK HISTORY =================

const getStockHistory = async (req, res) => {
    try {
        const symbol = req.params.symbol.toUpperCase();

        const history = await getHistoricalData(symbol);

        res.status(200).json({
            success: true,
            data: history,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= STOCK ANALYSIS =================

const getStockAnalysis = async (req, res) => {
    try {
        const symbol = req.params.symbol.toUpperCase();

        const history = await getHistoricalData(symbol);

        // Keep only valid closing prices
        const prices = history.quotes
            .filter(
                (item) =>
                    item.close !== null &&
                    item.close !== undefined &&
                    !isNaN(item.close)
            )
            .map((item) => ({
                date: item.date,
                close: item.close,
            }));

        // Need enough candles
        if (prices.length < 35) {
            return res.status(400).json({
                success: false,
                message: "Not enough historical data for technical analysis.",
            });
        }

        // Calculate indicators
        const sma20 = calculateSMA(prices, 20);
        const ema20 = calculateEMA(prices, 20);
        const rsi14 = calculateRSI(prices, 14);
        const macd = calculateMACD(prices);

        res.status(200).json({
            success: true,
            symbol,
            analysis: {
                sma20,
                ema20,
                rsi14,
                macd,
            },
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
    getStockHistory,
    getStockAnalysis,
};