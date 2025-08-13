import { Op } from 'sequelize';
import { Challenge } from '../models/index.js';
import { config } from '../config/index.js';

export async function createChallenge(userId, nonceHex) {
  return Challenge.create({ userId, nonceHex });
}

export async function getChallenge(nonceHex) {
  return Challenge.findOne({ where: { nonceHex } });
}

export async function markChallengeUsed(id) {
  const [count] = await Challenge.update(
    { used: true, usedAt: new Date() },
    { where: { id, used: false } }
  );
  return count === 1;
}

export async function expireOldChallenges() {
  const ttl = config.security.nonceTtlSec;
  const threshold = new Date(Date.now() - ttl * 1000);
  await Challenge.destroy({
    where: {
      [Op.or]: [
        { used: true },
        { createdAt: { [Op.lt]: threshold } }
      ]
    }
  });
}
