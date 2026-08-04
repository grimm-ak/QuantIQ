const {
    calculateSMA,
    calculateEMA,
} = require("./services/indicatorService");

const prices = [
    { date: "1", close: 10 },
    { date: "2", close: 18 },
    { date: "3", close: 15 },
    { date: "4", close: 30 },
    { date: "5", close: 22 },
    { date: "6", close: 35 },
    { date: "7", close: 40 },
];

console.log("SMA:");
console.log(calculateSMA(prices, 3));

console.log("\nEMA:");
console.log(calculateEMA(prices, 3));