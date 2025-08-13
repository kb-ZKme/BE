import crypto from 'node:crypto';
export const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest();
export const randBytes = (len) => crypto.randomBytes(len);
