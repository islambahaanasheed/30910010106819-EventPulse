const Event = require("../models/Event");
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');


// GET /api/events
exports.getEvents = async (req, res, next) => {
  try {
    const {
      category,
      city,
      search,
      startDate,
      endDate,
      page,
      limit,
      sortBy = "date",
      order = "asc"
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (city) filter.city = city;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        const parsedStartDate = new Date(startDate);

        if (Number.isNaN(parsedStartDate.getTime())) {
          return res.status(400).json({ message: "Invalid startDate" });
        }

        filter.date.$gte = parsedStartDate;
      }

      if (endDate) {
        const parsedEndDate = new Date(endDate);

        if (Number.isNaN(parsedEndDate.getTime())) {
          return res.status(400).json({ message: "Invalid endDate" });
        }

        filter.date.$lte = parsedEndDate;
      }
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const allowedSortFields = ["title", "date", "city", "capacity", "createdAt"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "date";
    const sortDirection = order === "desc" ? -1 : 1;
    const sort = { [safeSortBy]: sortDirection };

    const [data, total] = await Promise.all([
      Event.find(filter)
        .populate("category")
        .populate("organizer")
        .sort(sort)
        .skip(skip)
        .limit(limitNum),

      Event.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/events/:id
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("category")
      .populate("organizer");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ data: event });
  } catch (error) {
    next(error);
  }
};

// POST /api/events
exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);

    return res.status(201).json({
      message: "Event created successfully",
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/events/:id
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({
      message: "Event updated successfully",
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/events/:id
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({
      message: "Event deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};