const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
});

const generateAIAnalysis = async (data) => {
    const prompt = `
You are an expert stock market analyst.

Analyze the following technical indicators.

Stock Symbol: ${data.symbol}

Current Price: ${data.currentPrice}
Trading Signal: ${data.signal}
Signal Score: ${data.score}

SMA20: ${data.sma20}
EMA20: ${data.ema20}

RSI14: ${data.rsi}

MACD: ${data.macd}
Signal Line: ${data.signalLine}
Histogram: ${data.histogram}

Bollinger Upper: ${data.upperBand}
Bollinger Middle: ${data.middleBand}
Bollinger Lower: ${data.lowerBand}

Return ONLY valid JSON.

Example:

{
  "trend": "Bullish",
  "momentum": "Strong",
  "risk": "Medium",
  "confidence": 85,
  "recommendation": "BUY",
  "summary": "Short explanation in 3-4 lines.",
  "entryPrice": 1155,
  "targetPrice": 1215,
  "stopLoss": 1120,
  "pros": [
    "...",
    "..."
  ],
  "cons": [
    "...",
    "..."
  ]
}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    return JSON.parse(
        text.replace(/```json/g, "").replace(/```/g, "").trim()
    );
};

module.exports = {
    generateAIAnalysis,
};