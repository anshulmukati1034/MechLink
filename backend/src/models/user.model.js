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
        allowNull: true,
      },
      Email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Role: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      otp: {
        type: DataTypes.STRING(6),
      },
      otp_expires: {
        type: DataTypes.DATE,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};
