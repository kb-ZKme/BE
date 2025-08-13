export default (sequelize, DataTypes) => {
  const FaceKey = sequelize.define('face_keys', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    pubHex: { type: DataTypes.STRING(200), allowNull: false }
  }, {
    indexes: [{ unique: true, fields: ['userId'] }]
  });
  return FaceKey;
};
