const router = require("express").Router();
const { body } = require("express-validator");

const { requireAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");

const {
    createRegistration,
    getMyRegistrations,
    cancelRegistration
} = require("../controllers/registrations.controller");

router.post(
    "/",
    requireAuth,

    body("eventId")
        .isMongoId()
        .withMessage("Event ID must be a valid MongoId"),

    validate,
    createRegistration
);

router.get("/my", requireAuth, getMyRegistrations);

router.delete("/:id", requireAuth, cancelRegistration);

module.exports = router;