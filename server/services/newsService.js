
const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance();

const getStockNews = async (symbol) => {
    try {
        const news = await yahooFinance.search(symbol, {
            newsCount: 10,
        });

        return news.news || [];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = {
    getStockNews,
};