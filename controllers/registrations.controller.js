const Event = require("../models/Event");
const Registration = require("../models/Registration");
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/registrations
exports.createRegistration = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.userId;

    // 1. Check if the event exists
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // 2. Prevent duplicate registration
    const existingRegistration = await Registration.findOne({
      event: eventId,
      attendee: userId
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "You are already registered for this event"
      });
    }

    // 3. Check event capacity
    const registrationCount = await Registration.countDocuments({
      event: eventId
    });

    if (registrationCount >= event.capacity) {
      return res.status(400).json({
        message: "Event is full"
      });
    }

    // 4. Create the registration
    const registration = await Registration.create({
      event: eventId,
      attendee: userId
    });

    return res.status(201).json({
      message: "Registration successful",
      data: registration
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/registrations/my
exports.getMyRegistrations = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const registrations = await Registration.find({
      attendee: userId
    }).populate("event");

    return res.status(200).json({
      data: registrations
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/registrations/:id
exports.cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);

    // Registration does not exist
    if (!registration) {
      return res.status(404).json({
        message: "Registration not found"
      });
    }

    // Registration belongs to another user
    if (registration.attendee.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only cancel your own registration"
      });
    }

    await Registration.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Registration cancelled successfully"
    });
  } catch (error) {
    next(error);
  }
};