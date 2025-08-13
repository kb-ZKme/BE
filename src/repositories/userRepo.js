import { Sequelize } from 'sequelize';
import { User } from '../models/index.js';

export async function upsertUserByUserId(userId) {
  const [row] = await User.findOrCreate({ where: { userId }, defaults: { userId } });
  return row.id;
}

export async function getUserByUserId(userId) {
  return User.findOne({ where: { userId } });
}
