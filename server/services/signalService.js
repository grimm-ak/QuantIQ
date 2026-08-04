const generateSignal = ({
    currentPrice,
    sma20,
    ema20,
    rsi14,
    macd,
    bollingerBands,
}) => {

    let score = 0;
    const reasons = [];

    // ================= EMA =================

    if (currentPrice > ema20.value) {
        score += 2;
        reasons.push("Price above EMA20");
    } else {
        score -= 2;
        reasons.push("Price below EMA20");
    }

    // ================= SMA =================

    if (currentPrice > sma20.value) {
        score += 1;
        reasons.push("Price above SMA20");
    } else {
        score -= 1;
        reasons.push("Price below SMA20");
    }

    // ================= RSI =================

    if (rsi14.value < 30) {
        score += 2;
        reasons.push("RSI Oversold");
    }
    else if (rsi14.value > 70) {
        score -= 2;
        reasons.push("RSI Overbought");
    }
    else if (rsi14.value >= 50) {
        score += 1;
        reasons.push("Healthy RSI");
    }

    // ================= MACD =================

    if (macd.macd > macd.signal) {
        score += 2;
        reasons.push("Bullish MACD");
    } else {
        score -= 2;
        reasons.push("Bearish MACD");
    }

    // ================= Bollinger Bands =================

    if (currentPrice < bollingerBands.lower) {
        score += 2;
        reasons.push("Near Lower Bollinger Band");
    }

    if (currentPrice > bollingerBands.upper) {
        score -= 2;
        reasons.push("Near Upper Bollinger Band");
    }

    // ================= Final Signal =================

    let signal = "HOLD";

    if (score >= 4) signal = "BUY";
    else if (score <= -4) signal = "SELL";

    return {
        signal,
        score,
        reasons,
    };
};

module.exports = {
    generateSignal,
};