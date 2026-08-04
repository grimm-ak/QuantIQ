const calculateSMA = (prices, period) => {
    const sma = [];

    for (let i = period - 1; i < prices.length; i++) {
        let sum = 0;

        for (let j = i - period + 1; j <= i; j++) {
            sum += prices[j].close;
        }

        sma.push({
            date: prices[i].date,
            value: Number((sum / period).toFixed(2)),
        });
    }

    return sma;
};

const calculateEMA = (prices, period) => {
    const ema = [];

    if (prices.length < period) return ema;

    let sum = 0;

    for (let i = 0; i < period; i++) {
        sum += prices[i].close;
    }

    let previousEMA = sum / period;

    ema.push({
        date: prices[period - 1].date,
        value: Number(previousEMA.toFixed(2)),
    });

    const multiplier = 2 / (period + 1);

    for (let i = period; i < prices.length; i++) {
        const currentEMA =
            (prices[i].close - previousEMA) * multiplier + previousEMA;

        ema.push({
            date: prices[i].date,
            value: Number(currentEMA.toFixed(2)),
        });

        previousEMA = currentEMA;
    }

    return ema;
};

const calculateRSI = (prices, period = 14) => {
    const rsi = [];

    if (prices.length <= period) return rsi;

    let gain = 0;
    let loss = 0;

    for (let i = 1; i <= period; i++) {
        const change = prices[i].close - prices[i - 1].close;

        if (change > 0) {
            gain += change;
        } else {
            loss += Math.abs(change);
        }
    }

    let avgGain = gain / period;
    let avgLoss = loss / period;

    let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    let currentRSI = 100 - 100 / (1 + rs);

    rsi.push({
        date: prices[period].date,
        value: Number(currentRSI.toFixed(2)),
    });

    for (let i = period + 1; i < prices.length; i++) {
        const change = prices[i].close - prices[i - 1].close;

        const currentGain = change > 0 ? change : 0;
        const currentLoss = change < 0 ? Math.abs(change) : 0;

        avgGain = ((avgGain * (period - 1)) + currentGain) / period;
        avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period;

        rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        currentRSI = 100 - 100 / (1 + rs);

        rsi.push({
            date: prices[i].date,
            value: Number(currentRSI.toFixed(2)),
        });
    }

    return rsi;
};

const calculateMACD = (prices) => {
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);

    const ema12Map = {};

    ema12.forEach(item => {
        ema12Map[item.date] = item.value;
    });

    const macdLine = [];

    ema26.forEach(item => {
        if (ema12Map[item.date] !== undefined) {
            macdLine.push({
                date: item.date,
                value: Number((ema12Map[item.date] - item.value).toFixed(2)),
            });
        }
    });

    const signal = [];
    const histogram = [];

    if (macdLine.length < 9) {
        return {
            macd: macdLine,
            signal,
            histogram,
        };
    }

    // Initial Signal Line (9-period SMA of MACD)
    let sum = 0;

    for (let i = 0; i < 9; i++) {
        sum += macdLine[i].value;
    }

    let previousSignal = sum / 9;

    signal.push({
        date: macdLine[8].date,
        value: Number(previousSignal.toFixed(2)),
    });

    histogram.push({
        date: macdLine[8].date,
        value: Number((macdLine[8].value - previousSignal).toFixed(2)),
    });

    const multiplier = 2 / (9 + 1);

    for (let i = 9; i < macdLine.length; i++) {
        const currentSignal =
            (macdLine[i].value - previousSignal) * multiplier + previousSignal;

        signal.push({
            date: macdLine[i].date,
            value: Number(currentSignal.toFixed(2)),
        });

        histogram.push({
            date: macdLine[i].date,
            value: Number((macdLine[i].value - currentSignal).toFixed(2)),
        });

        previousSignal = currentSignal;
    }

    return {
        macd: macdLine,
        signal,
        histogram,
    };
};

module.exports = {
    calculateSMA,
    calculateEMA,
    calculateRSI,
    calculateMACD,
};