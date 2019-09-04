module.exports = function(sequelize, DataTypes) {
  const Comments = sequelize.define(
    "comments",
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true,
      freezeTableName: true,
      tableName: "comments"
    }
  );
  return Comments;
};
