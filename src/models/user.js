export default (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.STRING(64), allowNull: false, unique: true }
  }, {
    indexes: [{ unique: true, fields: ['userId'] }]
  });
  return User;
};
