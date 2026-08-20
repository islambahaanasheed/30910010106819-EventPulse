const Message = require("../models/Message");

const createAnnouncement = async (req, res, next) => {
    try {
        const { eventId, text } = req.body;

        const message = await Message.create({
            event: eventId,
            sender: req.user.userId,
            text
        });

        const io = req.app.get("io");

        io.to(eventId).emit("announcement", message);

        res.status(201).json({
            status: "success",
            data: message
        });
    } catch (error) {
        next(error);
    }
};

const getAnnouncements = async (req, res, next) => {
    try {
        const { eventId } = req.params;

        const messages = await Message.find({ event: eventId })
            .populate("sender")
            .sort({ createdAt: 1 });

        res.status(200).json({
            status: "success",
            data: messages
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createAnnouncement,
    getAnnouncements
};