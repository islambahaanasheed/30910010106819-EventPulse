const router = require("express").Router();
const { body, param } = require("express-validator");

const { requireAuth, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");

const ctrl = require("../controllers/events.controller");

router.get("/", ctrl.getEvents);

router.get("/:id", ctrl.getEventById);

router.post(
    "/",
    
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),

    body("category")
        .isMongoId()
        .withMessage("Category must be a valid MongoId"),

    body("date")
        .isISO8601()
        .withMessage("Date must be a valid date"),

    body("capacity")
        .isFloat({ gt: 0 })
        .withMessage("Capacity must be a positive number"),

    validate,
    requireAuth,
    requireRole("admin"),

    ctrl.createEvent
);

router.patch(
    "/:id",
    
    param("id")
        .isMongoId()
        .withMessage("ID must be a valid MongoId"),

    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty"),

    body("category")
        .optional()
        .isMongoId()
        .withMessage("Category must be a valid MongoId"),

    body("date")
        .optional()
        .isISO8601()
        .withMessage("Date must be a valid date"),

    body("capacity")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Capacity must be a positive number"),

    validate,
    requireAuth,
    requireRole("admin"),

    ctrl.updateEvent
);

router.delete(
    "/:id",
    requireAuth,
    requireRole("admin"),
    ctrl.deleteEvent
);

module.exports = router;