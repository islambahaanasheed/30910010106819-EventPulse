require("dotenv").config();

const http = require("http");
const express = require("express");
const morgan = require("morgan");
const mongoSanitize = require("@exortek/express-mongo-sanitize");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
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

// Central error handler
app.use(errorHandler);

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.io
const io = new Server(httpServer);

app.set("io", io);

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join-event", (eventId) => {
        socket.join(eventId);
        console.log(`Socket ${socket.id} joined event room: ${eventId}`);
    });

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

// Start server
const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await connectDB();

        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

start();