const { Op, Sequelize } = require("sequelize");
const db = require("../models/model.js");
const Mechanic = db.Mechanic;
const Category = db.Category;

//getmechanic nearby based on radius
exports.getMechanicsByCategoryID = async (req, res) => {
  try {
    const { categoryId, lat, lng } = req.body;

    if (!categoryId || !lat || !lng) {
      return res.status(400).json({
        message: "categoryId and location required",
      });
    }

    const limit = parseInt(req.body.limit) || 2;
    const offset = parseInt(req.body.offset) || 0;
    
    const radius = 1000; // KM

    const mechanics = await Mechanic.findAll({
      where: {
        Category_Id: categoryId,
        isAvailable: 1,
        [Op.and]: Sequelize.literal(`
          (6371 * acos(
            cos(radians(${lat}))
            * cos(radians(latitude))
            * cos(radians(longitude) - radians(${lng}))
            + sin(radians(${lat}))
            * sin(radians(latitude))
          )) <= ${radius}
        `),
      },

      include: [
        {
          model: Category,
          as: "category",
          attributes: ["Category_Id", "Category_Name"],
        },
      ],

      limit,
      offset: parseInt(offset),
      order: [["Mechanic_Id", "ASC"]],
    });

    const totalCount = await Mechanic.count({
      where: {
        Category_Id: categoryId,
        isAvailable: 1,
      },
    });

    res.status(200).json({
      mechanics,
      pagination: {
        limit,
        offset: parseInt(offset),
        total: totalCount,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



