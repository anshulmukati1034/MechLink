const express = require("express");
const router = express.Router();
const mechanicProfileController = require("../controllers/mechanicProfile.controller");

router.post("/profile", mechanicProfileController.getMechanicProfile);


module.exports = router;
