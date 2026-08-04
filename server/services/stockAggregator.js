const { getStockData } = require("./yahooService");

const getCompleteStockData = async (symbol) => {
    try {
        const yahooData = await getStockData(symbol);

        return {
            symbol: yahooData.symbol,
            companyName: yahooData.companyName,
            currentPrice: yahooData.currentPrice,
            marketCap: yahooData.marketCap,
            peRatio: yahooData.peRatio,
            volume: yahooData.volume,
            fiftyTwoWeekHigh: yahooData.fiftyTwoWeekHigh,
            fiftyTwoWeekLow: yahooData.fiftyTwoWeekLow,
            lastUpdated: new Date(),
            source: "Yahoo Finance",
        };

    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getCompleteStockData,
};