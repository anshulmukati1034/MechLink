module.exports = (sequelize, DataTypes) => {
  const MechanicProfile = sequelize.define(
    "MechanicProfile",
    {
      MechanicProfile_Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      Mechanic_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "mechanics",
          key: "Mechanic_Id",
        },
        onDelete: "CASCADE",
      },

      experience: {
        type: DataTypes.INTEGER, // years
        allowNull: false,
      },

      about: {
        type: DataTypes.TEXT,
      },

      services: {
        type: DataTypes.TEXT, // "Engine, Brake, Tyre"
      },

      working_hours: {
        type: DataTypes.STRING,
      },

      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
    },
    {
      tableName: "mechanic_profiles",
      timestamps: true,
    }
  );

  return MechanicProfile;
};
