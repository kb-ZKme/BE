import { FaceKey } from '../models/index.js';

export async function upsertFaceKey(userId, pubHex) {
  const existed = await FaceKey.findOne({ where: { userId } });
  if (existed) {
    existed.pubHex = pubHex;
    await existed.save();
    return existed;
  }
  return FaceKey.create({ userId, pubHex });
}

export async function getFaceKeyByUserPk(userId) {
  return FaceKey.findOne({ where: { userId } });
}
