const { QueryTypes } = require("sequelize");
const db = require("../models/model.js");
const sequelize = db.sequelize;

const Mechanic = db.Mechanic;

exports.getNearbyMechanics = async (req, res) => {
  try {
    let { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Location required! Provide lat and lng." });
    }

    lat = parseFloat(lat);
    lng = parseFloat(lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res
        .status(400)
        .json({ message: "Invalid latitude or longitude." });
    }

    radius = radius ? parseFloat(radius) : 5; // default 5 km
    if (Number.isNaN(radius) || radius <= 0) radius = 5;

    // Approximate bounding box for performance (1 degree ~ 111 km)
    const latDiff = radius / 111;
    const lngDiff = radius / (111 * Math.cos((lat * Math.PI) / 180));

    const mechanics = await sequelize.query(
      `SELECT name, phone, serviceType, latitude, longitude,
        (6371 * acos(
          cos(radians(:lat)) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians(:lng)) +
          sin(radians(:lat)) *
          sin(radians(latitude))
        )) AS distance
      FROM Mechanics
      WHERE latitude BETWEEN :latMin AND :latMax
        AND longitude BETWEEN :lngMin AND :lngMax
      HAVING distance <= :radius
      ORDER BY distance ASC`,
      {
        replacements: {
          lat,
          lng,
          radius,
          latMin: lat - latDiff,
          latMax: lat + latDiff,
          lngMin: lng - lngDiff,
          lngMax: lng + lngDiff,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({ mechanics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!" });
  }
};

