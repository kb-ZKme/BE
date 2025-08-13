// src/models/index.js
import { Sequelize, DataTypes } from 'sequelize';
import { config } from '../config/index.js';
import UserModel from './user.js';
import FaceKeyModel from './faceKey.js';
import ChallengeModel from './challenge.js';

export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.pass,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
      paranoid: false,
    },
    dialectOptions: {
      charset: 'utf8mb4',
      multipleStatements: true,
    },
  }
);

// 모델 정의
export const User = UserModel(sequelize, DataTypes);
export const FaceKey = FaceKeyModel(sequelize, DataTypes);
export const Challenge = ChallengeModel(sequelize, DataTypes);

// 연관관계
User.hasOne(FaceKey, { foreignKey: 'userId', as: 'faceKey', onDelete: 'CASCADE' });
FaceKey.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Challenge, { foreignKey: 'userId', as: 'challenges', onDelete: 'CASCADE' });
Challenge.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 개발환경은 alter sync (운영은 migration 권장)
export async function syncModels() {
  if (config.env !== 'production') {
    await sequelize.sync({ alter: true });
  } else {
    await sequelize.sync();
  }
}

// 호환용 default export (있어도 되고 없어도 됨)
export default { sequelize, User, FaceKey, Challenge, syncModels };
