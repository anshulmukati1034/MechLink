const express=require('express');
const router = express.Router();
const mechanicController = require('../controllers/mechanic.controller.js');    

router.get('/nearby', mechanicController.getNearbyMechanics);

module.exports = router;