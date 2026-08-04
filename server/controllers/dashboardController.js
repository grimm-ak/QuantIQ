const User = require("../models/User");
const Portfolio = require("../models/Portfolio");
const Watchlist = require("../models/Watchlist");
const { getStockData } = require("../services/yahooService");

const getDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        const portfolio = await Portfolio.find({ user: req.user.id });

        const watchlist = await Watchlist.find({ user: req.user.id });

        let totalInvestment = 0;
        let totalCurrentValue = 0;

        let bestStock = null;
        let worstStock = null;

        const portfolioData = [];

        for (const stock of portfolio) {

            const live = await getStockData(stock.symbol);

            const investment = stock.quantity * stock.averagePrice;

            const currentValue = stock.quantity * live.currentPrice;

            const pnl = currentValue - investment;

            const pnlPercent = (pnl / investment) * 100;

            totalInvestment += investment;
            totalCurrentValue += currentValue;

            const item = {
                symbol: stock.symbol,
                companyName: stock.companyName,
                quantity: stock.quantity,
                currentPrice: live.currentPrice,
                pnl,
                pnlPercent,
            };

            portfolioData.push(item);

            if (!bestStock || pnlPercent > bestStock.pnlPercent)
                bestStock = item;

            if (!worstStock || pnlPercent < worstStock.pnlPercent)
                worstStock = item;
        }

        res.json({
            success: true,

            user,

            summary: {
                totalInvestment,
                totalCurrentValue,
                totalProfitLoss:
                    totalCurrentValue - totalInvestment,

                totalProfitLossPercent:
                    totalInvestment > 0
                        ? (
                              ((totalCurrentValue -
                                  totalInvestment) /
                                  totalInvestment) *
                              100
                          ).toFixed(2)
                        : 0,
            },

            portfolio: portfolioData,

            watchlist,

            topPerformer: bestStock,

            worstPerformer: worstStock,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    getDashboard,
};