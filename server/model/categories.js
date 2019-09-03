// const sequelize = require("./index");
// const Sequelize = require("sequelize");
// const Titles = require("./titles");

module.exports = function(sequelize, DataTypes) {
  const Categories = sequelize.define(
    "categories",
    {
      name: {
        field: "name",
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      charset: "utf8",
      collate: "utf8_unicode_ci",
      underscored: true,
      freezeTableName: true,
      tableName: "categories"
    }
  );
  Categories.associate = function(models) {
    models.categories.hasMany(models.ca_comments, {
      foreignKey: "category_id",
      onDelete: "cascade"
    });
  };
  return Categories;
};

// Categories.belongsTo(Titles);

// module.exports = Categories;
