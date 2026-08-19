const router = require("express").Router();
const {  requireAuth} = require("../middleware/auth");

const {
  createRegistration,
  getMyRegistrations,
  cancelRegistration
} = require("../controllers/registrations.controller");

router.post("/", requireAuth, createRegistration);
router.get("/my", requireAuth, getMyRegistrations);
router.delete("/:id", requireAuth, cancelRegistration);

module.exports = router;