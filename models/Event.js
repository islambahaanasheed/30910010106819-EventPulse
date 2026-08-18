const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Event title is required"],
            trim: true
        },

        description: {
            type: String,
            required: [true, "Event description is required"],
            trim: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Event category is required"]
        },

        date: {
            type: Date,
            required: [true, "Event date is required"]
        },

        city: {
            type: String,
            required: [true, "Event city is required"],
            trim: true
        },

        venue: {
            type: String,
            required: [true, "Event venue is required"],
            trim: true
        },

        capacity: {
            type: Number,
            required: [true, "Event capacity is required"],
            min: [1, "Capacity must be at least 1"]
        },

        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Event organizer is required"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Event", eventSchema);