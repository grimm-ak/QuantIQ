const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Protected Route Accessed",
        user: req.user,
    });
});

module.exports = router;