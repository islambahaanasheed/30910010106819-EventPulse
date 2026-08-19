const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const {
    register,
    login
} = require("../controllers/auth.controller");

const validate = require("../middleware/validate");

router.post(
    "/register",

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Email must be valid"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    validate,
    register
);

router.post(
    "/login",

    body("email")
        .isEmail()
        .withMessage("Email must be valid"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    validate,
    login
);

module.exports = router;