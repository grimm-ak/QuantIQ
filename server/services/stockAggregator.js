const { getStockData } = require("./yahooService");

const getCompleteStockData = async (symbol) => {
    try {
        // Yahoo Finance Data
        const yahooData = await getStockData(symbol);

        return {
            yahoo: yahooData,
        };

    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getCompleteStockData,
};