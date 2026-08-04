require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const stockRoutes = require("./routes/stockRoutes");

const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stocks", stockRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "QuantIQ Backend Running 🚀",
        database: "Connected ✅",
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});