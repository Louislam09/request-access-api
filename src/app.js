const express = require("express");
const cors = require("cors");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api", requestRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Graceful shutdown
const db = require("./models/database");
process.on("SIGINT", async () => {
    try {
        await db.close();
        console.log("Database connection closed");
        process.exit(0);
    } catch (err) {
        console.error("Error closing database:", err);
        process.exit(1);
    }
});

module.exports = app;
