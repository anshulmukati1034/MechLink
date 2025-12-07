const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.js");

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});


// Test DB connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

 

// Initialize Models
const db = {};

db.Sequelize = sequelize;
db.sequelize = sequelize;

db.Mechanic = require("../models/mechanic.model.js")(sequelize, DataTypes);



module.exports = db;