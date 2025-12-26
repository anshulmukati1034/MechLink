// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");

router.post("/send-otp", userController.sendOtp);
router.post("/verify-otp", userController.verifyOtp);
router.post("/signup-with-otp", userController.signupWithOtp);
// router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

module.exports = router;
