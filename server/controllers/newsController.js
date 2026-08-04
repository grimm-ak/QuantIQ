const { getStockNews } = require("../services/newsService");
const { getCompleteStockData } = require("../services/stockAggregator");

// ================= STOCK NEWS =================

const getNews = async (req, res) => {
    try {
        const symbol = req.params.symbol.toUpperCase();

        // Get company details
        const stock = await getCompleteStockData(symbol);

        // Search news using company name instead of ticker
        const news = await getStockNews(stock.companyName);

        res.status(200).json({
            success: true,
            symbol,
            company: stock.companyName,
            news,
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
    getNews,
};