import bcrypt from 'bcrypt';
import { prisma } from '../db';
import { signToken } from '../utils/jwt';
import type { Role, User } from '@prisma/client';
import speakeasy from 'speakeasy';

export async function registerUser(params: { email: string; password: string; name: string; role?: Role }) {
  const { email, password, name } = params;
  const role: Role = params.role ?? 'EMPLOYEE';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw Object.assign(new Error('Email already in use'), { status: 400 });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, passwordHash, name, role } });
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export async function authenticateUser(params: { email: string; password: string }) {
  const { email, password } = params;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  if (user.mfaEnabled) {
    const tempToken = signToken(user.id, user.role, { mfa: true, expiresInSeconds: 600 });
    return { mfaRequired: true as const, tempToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }
  const token = signToken(user.id, user.role);
  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}

export async function setupMfa(userId: string) {
  const secret = speakeasy.generateSecret({ length: 20, name: `EMS (${userId})` });
  await prisma.user.update({ where: { id: userId }, data: { mfaSecret: secret.base32 } });
  return { otpauthUrl: secret.otpauth_url!, base32: secret.base32 };
}

export async function verifyMfaAndIssueToken(params: { userId: string; token: string }) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } });
  if (!user || !user.mfaSecret) throw Object.assign(new Error('MFA not configured'), { status: 400 });
  const valid = speakeasy.totp.verify({ secret: user.mfaSecret, encoding: 'base32', token: params.token, window: 1 });
  if (!valid) throw Object.assign(new Error('Invalid MFA code'), { status: 401 });
  await prisma.user.update({ where: { id: user.id }, data: { mfaEnabled: true } });
  return { token: signToken(user.id, user.role) };
}