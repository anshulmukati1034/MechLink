// controllers/categoryController.js
const db = require("../models/model.js");
const Category = db.Category;

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["Category_Id", "Category_Name"],
      order: [["Category_Id", "ASC"]],
    });
    res.json({ count: categories.length, categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
