const express = require("express");
const router = express.Router();
const mechanicController = require("../controllers/mechanic.controller");

router.post("/by-category", mechanicController.getMechanicsByCategoryID);


module.exports = router;
