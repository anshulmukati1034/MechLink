// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

module.exports = router;
