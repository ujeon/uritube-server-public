module.exports = function(sequelize, DataTypes) {
  const Comments = sequelize.define(
    "user_comments",
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true,
      freezeTableName: true,
      tableName: "user_comments"
    }
  );
  return Comments;
};
