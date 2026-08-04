const express = require("express");

const { searchStock } = require("../controllers/stockController");

const router = express.Router();

router.get("/search/:symbol", searchStock);

module.exports = router;