require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/events.routes");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(mongoSanitize());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "EventPulse API is running"
    });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        status: "fail",
        message: "Route not found"
    });
});

// Central error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

start();