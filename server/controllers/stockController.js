const Stock = require("../models/Stock");
const { getCompleteStockData } = require("../services/stockAggregator");
const { getHistoricalData } = require("../services/yahooService");
const { generateAIAnalysis } = require("../services/aiService");

const {
    calculateSMA,
    calculateEMA,
    calculateRSI,
    calculateMACD,
    calculateBollingerBands,
} = require("../services/indicatorService");

const { generateSignal } = require("../services/signalService");

// ================= SEARCH STOCK =================

const searchStock = async (req, res) => {
    try {
        const symbol = req.params.symbol.toUpperCase();

        const cachedStock = await Stock.findOne({ symbol });

        if (cachedStock) {
            return res.status(200).json({
                success: true,
                source: "MongoDB Cache",
                data: cachedStock,
            });
        }

        const stock = await getCompleteStockData(symbol);

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

        if (prices.length < 35) {
            return res.status(400).json({
                success: false,
                message: "Not enough historical data.",
            });
        }

        const sma20 = calculateSMA(prices, 20);
        const ema20 = calculateEMA(prices, 20);
        const rsi14 = calculateRSI(prices, 14);
        const macd = calculateMACD(prices);
        const bollingerBands = calculateBollingerBands(prices);

        const latestSMA = sma20[sma20.length - 1];
        const latestEMA = ema20[ema20.length - 1];
        const latestRSI = rsi14[rsi14.length - 1];

        const latestMACD = {
            macd: macd.macd[macd.macd.length - 1]?.value,
            signal: macd.signal[macd.signal.length - 1]?.value,
            histogram: macd.histogram[macd.histogram.length - 1]?.value,
        };

        const latestBB = bollingerBands[bollingerBands.length - 1];

        const currentPrice = prices[prices.length - 1].close;

        const signal = generateSignal({
            currentPrice,
            sma20: latestSMA,
            ema20: latestEMA,
            rsi14: latestRSI,
            macd: latestMACD,
            bollingerBands: latestBB,
        });

        res.status(200).json({
            success: true,
            symbol,
            analysis: {
                currentPrice,
                signal,
        
                indicators: {
                    sma20: latestSMA,
                    ema20: latestEMA,
                    rsi14: latestRSI,
        
                    macd: {
                        macd: latestMACD.macd,
                        signal: latestMACD.signal,
                        histogram: latestMACD.histogram,
                    },
        
                    bollingerBands: latestBB,
                },
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

// ================= COMPARE STOCKS =================

const compareStocks = async (req, res) => {
    try {
        if (!req.query.symbols) {
            return res.status(400).json({
                success: false,
                message:
                    "Please provide symbols. Example: ?symbols=INFY.NS,TCS.NS",
            });
        }

        const symbols = req.query.symbols
              .split(",")
              .map((symbol) => symbol.trim().toUpperCase())
              .filter(Boolean);

        const comparison = [];

        for (const symbol of symbols) {
            let stock = await Stock.findOne({ symbol });

if (!stock) {
    const latest = await getCompleteStockData(symbol);

    stock = await Stock.findOneAndUpdate(
        { symbol },
        latest,
        {
            new: true,
            upsert: true,
        }
    );
}

            const history = await getHistoricalData(symbol);

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

            const sma20 = calculateSMA(prices, 20);
            const ema20 = calculateEMA(prices, 20);
            const rsi14 = calculateRSI(prices, 14);
            const macd = calculateMACD(prices);
            const bollinger = calculateBollingerBands(prices);
            const signal = generateSignal({
                currentPrice: prices[prices.length - 1].close,
                sma20: sma20[sma20.length - 1],
                ema20: ema20[ema20.length - 1],
                rsi14: rsi14[rsi14.length - 1],
                macd: {
                    macd: macd.macd[macd.macd.length - 1]?.value,
                    signal: macd.signal[macd.signal.length - 1]?.value,
                },
                bollingerBands: bollinger[bollinger.length - 1],
            });

            comparison.push({
                symbol,
                companyName: stock.companyName,
                currentPrice: stock.currentPrice,
                marketCap: stock.marketCap,
                peRatio: stock.peRatio,
                rsi: rsi14[rsi14.length - 1]?.value,
                signal: signal.signal,
            });
        }

        res.status(200).json({
            success: true,
            comparison,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= AI ANALYSIS =================

const getAIAnalysis = async (req, res) => {
    try {
        const symbol = req.params.symbol.toUpperCase();

        const history = await getHistoricalData(symbol);

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

        if (prices.length < 35) {
            return res.status(400).json({
                success: false,
                message: "Not enough historical data.",
            });
        }

        const sma20 = calculateSMA(prices, 20);
        const ema20 = calculateEMA(prices, 20);
        const rsi14 = calculateRSI(prices, 14);
        const macd = calculateMACD(prices);
        const bollingerBands = calculateBollingerBands(prices);

        const latestSMA = sma20[sma20.length - 1];
        const latestEMA = ema20[ema20.length - 1];
        const latestRSI = rsi14[rsi14.length - 1];

        const latestMACD = macd.macd[macd.macd.length - 1];
        const latestSignal = macd.signal[macd.signal.length - 1];
        const latestHistogram = macd.histogram[macd.histogram.length - 1];

        const latestBB = bollingerBands[bollingerBands.length - 1];

        const currentPrice = prices[prices.length - 1].close;

        const signal = generateSignal({
            currentPrice,
            sma20: latestSMA,
            ema20: latestEMA,
            rsi14: latestRSI,
            macd: {
                macd: latestMACD?.value,
                signal: latestSignal?.value,
                histogram: latestHistogram?.value,
            },
            bollingerBands: latestBB,
        });

        const aiAnalysis = await generateAIAnalysis({
            symbol,
            currentPrice,
            signal: signal.signal,
            score: signal.score,
            sma20: latestSMA.value,
            ema20: latestEMA.value,
            rsi: latestRSI.value,
            macd: latestMACD?.value,
            signalLine: latestSignal?.value,
            histogram: latestHistogram?.value,
            upperBand: latestBB.upper,
            middleBand: latestBB.middle,
            lowerBand: latestBB.lower,
        });

        res.status(200).json({
            success: true,
            symbol,
            aiAnalysis,
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
    getAIAnalysis,
    compareStocks,
};