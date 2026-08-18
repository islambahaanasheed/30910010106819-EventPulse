const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");

const User = require("./models/User");
const Category = require("./models/Category");
const Event = require("./models/Event");
const Registration = require("./models/Registration");
const Message = require("./models/Message");

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log("Connected to MongoDB for seeding");

        // Clear old data in dependency order
        await Message.deleteMany({});
        await Registration.deleteMany({});
        await Event.deleteMany({});
        await User.deleteMany({});
        await Category.deleteMany({});

        console.log("Old data cleared");

        // =========================
        // CATEGORIES
        // =========================

        const categories = await Category.insertMany([
            {
                name: "Technology",
                description: "Technology and innovation events"
            },
            {
                name: "Sports",
                description: "Sports and fitness events"
            },
            {
                name: "Music",
                description: "Music and entertainment events"
            },
            {
                name: "Education",
                description: "Educational and learning events"
            }
        ]);

        console.log("Categories seeded successfully");

        // =========================
        // USERS
        // =========================

        const adminPassword = await bcrypt.hash("Admin123!", 10);
        const attendeePassword = await bcrypt.hash("Attendee123!", 10);

        const admin = await User.create({
            name: "EventPulse Admin",
            email: "admin@eventpulse.com",
            password: adminPassword,
            role: "admin"
        });

        const attendee = await User.create({
            name: "Test Attendee",
            email: "attendee@eventpulse.com",
            password: attendeePassword,
            role: "attendee"
        });

        console.log("Users seeded successfully");

        // =========================
        // EVENTS
        // =========================

        const events = await Event.insertMany([
            {
                title: "Tech Innovation Summit",
                description: "A conference focused on modern technology and innovation.",
                category: categories[0]._id,
                date: new Date("2026-10-15T10:00:00"),
                city: "Cairo",
                venue: "Cairo International Convention Centre",
                capacity: 500,
                organizer: admin._id
            },
            {
                title: "Cairo Sports Festival",
                description: "A community sports event featuring several athletic activities.",
                category: categories[1]._id,
                date: new Date("2026-10-20T09:00:00"),
                city: "Cairo",
                venue: "Cairo Stadium",
                capacity: 1000,
                organizer: admin._id
            },
            {
                title: "Live Music Night",
                description: "An evening featuring live performances from local musicians.",
                category: categories[2]._id,
                date: new Date("2026-11-05T18:00:00"),
                city: "Giza",
                venue: "Giza Cultural Center",
                capacity: 300,
                organizer: admin._id
            },
            {
                title: "Web Development Workshop",
                description: "A practical workshop covering modern web development concepts.",
                category: categories[3]._id,
                date: new Date("2026-11-12T11:00:00"),
                city: "Cairo",
                venue: "Technology Innovation Hub",
                capacity: 100,
                organizer: admin._id
            }
        ]);

        console.log("Events seeded successfully");

        // =========================
        // REGISTRATIONS
        // =========================

        await Registration.create([
            {
                event: events[0]._id,
                attendee: attendee._id,
                status: "registered"
            },
            {
                event: events[1]._id,
                attendee: attendee._id,
                status: "registered"
            }
        ]);

        console.log("Registrations seeded successfully");

        // =========================
        // MESSAGES
        // =========================

        await Message.create([
            {
                event: events[0]._id,
                sender: attendee._id,
                text: "Is there a schedule available for the conference?"
            },
            {
                event: events[0]._id,
                sender: admin._id,
                text: "Yes, the full schedule will be available before the event."
            }
        ]);

        console.log("Messages seeded successfully");

        console.log("Seed completed successfully!");
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
    }
};

seedDatabase();