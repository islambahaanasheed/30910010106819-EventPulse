const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const {
    register,
    login,
} = require("../controllers/auth.controller");


router.post("/register", register);
router.post("/login", login);

module.exports = router;