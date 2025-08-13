import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import type { Role } from '@prisma/client';

export const signToken = (
  userId: string,
  role: Role,
  opts?: { mfa?: boolean; expiresInSeconds?: number }
) => {
  const payload = { sub: userId, role, mfa: opts?.mfa ?? false };
  const secret: Secret = config.jwtSecret as unknown as Secret;
  const expiresIn: number = opts?.expiresInSeconds ?? (opts?.mfa ? 600 : 604800);
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
};