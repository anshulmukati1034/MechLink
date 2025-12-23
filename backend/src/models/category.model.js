module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      Category_Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      
      Category_Name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "categories",
      timestamps: true,
    }
  );

  return Category;
};
