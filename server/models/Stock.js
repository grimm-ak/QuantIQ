const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        companyName: {
            type: String,
            required: true,
        },

        sector: String,

        currentPrice: Number,

        marketCap: Number,

        peRatio: Number,

        roe: Number,

        roce: Number,

        fiftyTwoWeekHigh: Number,

        fiftyTwoWeekLow: Number,

        volume: Number,

        source: {
            type: String,
            default: "Yahoo Finance",
        },

        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Stock", stockSchema);