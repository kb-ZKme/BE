import { randBytes } from '../utils/crypto.js';
import { upsertUserByUserId, getUserByUserId } from '../repositories/userRepo.js';
import { upsertFaceKey, getFaceKeyByUserPk } from '../repositories/faceKeyRepo.js';
import { createChallenge, getChallenge, markChallengeUsed, expireOldChallenges } from '../repositories/challengeRepo.js';
import { verifySchnorr } from '../services/zkService.js';
import { config } from '../config/index.js';

export async function register(req, res, next) {
  try {
    const { userId, pub } = req.body || {};
    if (!userId || !pub) return res.status(400).json({ ok: false, error: 'missing userId/pub' });

    const userPk = await upsertUserByUserId(userId);
    await upsertFaceKey(userPk, pub);
    return res.json({ ok: true });
  } catch (e) { next(e); }
}

export async function challenge(req, res, next) {
  try {
    const { userId } = req.query || {};
    if (!userId) return res.status(400).json({ error: 'missing userId' });

    const user = await getUserByUserId(userId);
    if (!user) return res.status(404).json({ error: 'unknown user' });

    const face = await getFaceKeyByUserPk(user.id);
    if (!face) return res.status(400).json({ error: 'face not registered' });

    const nonceHex = randBytes(32).toString('hex');
    await createChallenge(user.id, nonceHex);
    expireOldChallenges().catch(() => {});
    return res.json({ nonce: nonceHex, ttlSec: config.security.nonceTtlSec });
  } catch (e) { next(e); }
}

export async function verify(req, res, next) {
  try {
    const { userId, R, z, nonce } = req.body || {};
    if (!userId || !R || !z || !nonce) return res.status(400).json({ verified: false, error: 'missing params' });

    const user = await getUserByUserId(userId);
    if (!user) return res.status(404).json({ verified: false, error: 'unknown user' });

    const chal = await getChallenge(nonce);
    if (!chal || chal.userId !== user.id) return res.status(400).json({ verified: false, error: 'bad nonce' });

    const ageSec = (Date.now() - new Date(chal.createdAt).getTime()) / 1000;
    if (ageSec > config.security.nonceTtlSec) return res.status(400).json({ verified: false, error: 'nonce expired' });

    const face = await getFaceKeyByUserPk(user.id);
    if (!face) return res.status(400).json({ verified: false, error: 'face not registered' });

    const ok = verifySchnorr({ pubHex: face.pubHex, RHex: R, zHex: z, nonceHex: nonce });
    if (!ok) return res.status(401).json({ verified: false });

    await markChallengeUsed(chal.id);
    return res.json({ verified: true });
  } catch (e) { next(e); }
}
