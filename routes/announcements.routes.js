const router = require("express").Router();

const { requireAuth, requireRole } = require("../middleware/auth");

const {
    createAnnouncement,
    getAnnouncements
} = require("../controllers/announcements.controller");

router.post(
    "/",
    requireAuth,
    requireRole("admin"),
    createAnnouncement
);

router.get("/:eventId", getAnnouncements);

module.exports = router;