module.exports = (sequelize, DataTypes) => {
  const Mechanic = sequelize.define(
    "Mechanic",
    {
      Mechanic_Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      Category_Id: {
        type: DataTypes.INTEGER,
        allowNull: true, // allow null if category deleted
        references: {
          model: "categories",
          key: "Category_Id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // safe now
      },

      Mechanic_Name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      Mechanic_Shop_Name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      vehicleType: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
      },

      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
      },

      isAvailable: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },
    },
    {
      tableName: "mechanics",
      timestamps: true,
    }
  );
  return Mechanic;
};
