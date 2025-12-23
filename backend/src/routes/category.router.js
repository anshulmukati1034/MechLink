const express=require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller.js');    

router.get('/', categoryController.getAllCategories);

module.exports = router;