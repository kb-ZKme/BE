// src/models/challenge.js
export default (sequelize, DataTypes) => {
  const Challenge = sequelize.define('challenges', {
    id:        { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    userId:    { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    nonceHex:  { type: DataTypes.CHAR(64), allowNull: false, unique: true },
    used:      { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    usedAt:    { type: DataTypes.DATE, allowNull: true },
  }, {
    indexes: [
      { unique: true, fields: ['nonceHex'] },
      { fields: ['userId', 'createdAt'] },
    ],
    timestamps: true,
    freezeTableName: true,
  });

  return Challenge;
};
