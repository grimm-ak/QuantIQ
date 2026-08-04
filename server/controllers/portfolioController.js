const Portfolio = require("../models/Portfolio");
const Stock = require("../models/Stock");

// ================= ADD STOCK =================

const addStock = async (req, res) => {
    try {
        const { symbol, companyName, quantity, averagePrice } = req.body;

        // Check if stock already exists in portfolio
        const existing = await Portfolio.findOne({
            user: req.user.id,
            symbol,
        });

        if (existing) {
            const totalQuantity = existing.quantity + quantity;

            const newAveragePrice =
                (
                    existing.quantity * existing.averagePrice +
                    quantity * averagePrice
                ) / totalQuantity;

            existing.quantity = totalQuantity;
            existing.averagePrice = Number(newAveragePrice.toFixed(2));

            await existing.save();

            return res.json({
                success: true,
                message: "Portfolio updated",
                data: existing,
            });
        }

        const portfolio = await Portfolio.create({
            user: req.user.id,
            symbol,
            companyName,
            quantity,
            averagePrice,
        });

        res.status(201).json({
            success: true,
            message: "Stock added to portfolio",
            data: portfolio,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET PORTFOLIO =================

const getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.find({
            user: req.user.id,
        });

        let totalInvestment = 0;
        let totalCurrentValue = 0;

        const portfolioData = await Promise.all(
            portfolio.map(async (holding) => {
                const stock = await Stock.findOne({
                    symbol: holding.symbol,
                });

                const currentPrice = stock?.currentPrice || 0;

                const investment =
                    holding.quantity * holding.averagePrice;

                const currentValue =
                    holding.quantity * currentPrice;

                const profitLoss =
                    currentValue - investment;

                const profitLossPercent =
                    investment > 0
                        ? (profitLoss / investment) * 100
                        : 0;

                totalInvestment += investment;
                totalCurrentValue += currentValue;

                return {
                    id: holding._id,
                    symbol: holding.symbol,
                    companyName: holding.companyName,
                    quantity: holding.quantity,
                    averagePrice: holding.averagePrice,
                    currentPrice,
                    investment: Number(investment.toFixed(2)),
                    currentValue: Number(currentValue.toFixed(2)),
                    profitLoss: Number(profitLoss.toFixed(2)),
                    profitLossPercent: Number(
                        profitLossPercent.toFixed(2)
                    ),
                };
            })
        );

        const totalProfitLoss =
            totalCurrentValue - totalInvestment;

        const totalProfitLossPercent =
            totalInvestment > 0
                ? (totalProfitLoss / totalInvestment) * 100
                : 0;

        res.json({
            success: true,
            portfolio: portfolioData,
            summary: {
                totalInvestment: Number(
                    totalInvestment.toFixed(2)
                ),
                totalCurrentValue: Number(
                    totalCurrentValue.toFixed(2)
                ),
                totalProfitLoss: Number(
                    totalProfitLoss.toFixed(2)
                ),
                totalProfitLossPercent: Number(
                    totalProfitLossPercent.toFixed(2)
                ),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= UPDATE HOLDING =================

const updateHolding = async (req, res) => {
    try {
        const { quantity, averagePrice } = req.body;

        const holding = await Portfolio.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!holding) {
            return res.status(404).json({
                success: false,
                message: "Holding not found",
            });
        }

        if (quantity) {
            holding.quantity = quantity;
        }

        if (averagePrice) {
            holding.averagePrice = averagePrice;
        }

        await holding.save();

        res.json({
            success: true,
            message: "Holding updated",
            data: holding,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= DELETE HOLDING =================

const deleteHolding = async (req, res) => {
    try {
        const holding = await Portfolio.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!holding) {
            return res.status(404).json({
                success: false,
                message: "Holding not found",
            });
        }

        await holding.deleteOne();

        res.json({
            success: true,
            message: "Holding removed",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    addStock,
    getPortfolio,
    updateHolding,
    deleteHolding,
};