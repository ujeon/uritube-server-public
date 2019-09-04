module.exports = function(sequelize, DataTypes) {
  const Comments = sequelize.define(
    "ca_comments",
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true,
      freezeTableName: true,
      tableName: "ca_comments"
    }
  );
  return Comments;
};
