const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: [true, "Event is required"]
        },

        attendee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Attendee is required"]
        },

        status: {
            type: String,
            enum: ["registered", "cancelled"],
            default: "registered"
        }
    },
    {
        timestamps: true
    }
);

registrationSchema.index(
    { event: 1, attendee: 1 },
    { unique: true }
);

module.exports = mongoose.model("Registration", registrationSchema);