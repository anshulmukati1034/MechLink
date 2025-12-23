module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      User_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // 1 = user, 3 = admin
      },
    },
    {
      tableName: "users", 
      timestamps: true,
    }
  );
  return User;
};
