require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoSanitize = require("@exortek/express-mongo-sanitize");

const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/events.routes");
const registrationRoutes = require("./routes/registrations.routes");
const announcementRoutes = require("./routes/announcements.routes");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(mongoSanitize());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/announcements", announcementRoutes);

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

// MUST remain last
app.use(errorHandler);

module.exports = app;