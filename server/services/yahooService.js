const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance();

const getStockData = async (symbol) => {
    try {
        const quote = await yahooFinance.quote(symbol);
        return {
            symbol: quote.symbol,
            companyName: quote.longName,
            currentPrice: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            open: quote.regularMarketOpen,
            dayHigh: quote.regularMarketDayHigh,
            dayLow: quote.regularMarketDayLow,
            previousClose: quote.regularMarketPreviousClose,
            volume: quote.regularMarketVolume,
            marketCap: quote.marketCap,
            peRatio: quote.trailingPE,
            forwardPE: quote.forwardPE,
            eps: quote.epsTrailingTwelveMonths,
            dividendYield: quote.dividendYield,
            fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
            fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getStockData,
};