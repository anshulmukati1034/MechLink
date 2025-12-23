const db = require("../models/model.js");
const Mechanic = db.Mechanic;
const MechanicProfile = db.MechanicProfile;


exports.getMechanicProfile = async (req, res) => {
  try {
    const { mechanicId } = req.body;

    if (!mechanicId) {
      return res.status(400).json({
        message: "mechanicId is required",
      });
    }

    const mechanic = await MechanicProfile.findOne({
      where: { Mechanic_Id: mechanicId },
      include: [
        {
          model: Mechanic,
        },
      ],
    });

    if (!mechanic) {
      return res.status(404).json({
        message: "Mechanic not found",
      });
    }

    res.status(200).json({
      success: true,
      data: mechanic,
    });
  } catch (error) {
    console.error("Profile API error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

