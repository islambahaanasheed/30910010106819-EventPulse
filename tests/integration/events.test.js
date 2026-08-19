const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../app");
const connectDB = require("../../config/db");

// Register Mongoose models
require("../../models/Category");
require("../../models/User");
require("../../models/Event");

describe("Events API", () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test("GET /api/events returns 200 and an array of events", async () => {
        const response = await request(app)
            .get("/api/events");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("POST /api/events without JWT returns 401", async () => {
        const response = await request(app)
            .post("/api/events")
            .send({
                title: "Test Event",
                category: "507f1f77bcf86cd799439011",
                date: "2026-09-01",
                capacity: 50
            });

        expect(response.statusCode).toBe(401);
    });

    test("POST /api/events with missing required fields returns 422", async () => {
        const response = await request(app)
            .post("/api/events")
            .send({});

        expect(response.statusCode).toBe(422);
        expect(Array.isArray(response.body.errors)).toBe(true);
    });
});