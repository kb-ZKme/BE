import * as secp from '@noble/secp256k1'
import { sha256 } from '../utils/crypto.js';

/** Schnorr PoK 검증: z·G == R + c·P  (c = H(nonce) mod n) */
export function verifySchnorr({ pubHex, RHex, zHex, nonceHex }) {
    const P = secp.Point.fromHex(pubHex);
    const R = secp.Point.fromHex(RHex);
    const z = BigInt('0x' + zHex);
    const cBytes = sha256(Buffer.from(nonceHex, 'hex'));
    const c = BigInt('0x' + cBytes.toString('hex')) % secp.CURVE.n;
    const left = secp.Point.BASE.multiply(z);
    const right = R.add(P.multiply(c));
  return left.equals(right);
}
