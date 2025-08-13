import type { Request, Response } from 'express';
import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { registerUser, authenticateUser, setupMfa, verifyMfaAndIssueToken } from '../services/userService';

export async function register(req: Request, res: Response) {
  const { email, password, name, role } = req.body ?? {};
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing required fields' });
  const user = await registerUser({ email, password, name, role });
  return res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
  const result = await authenticateUser({ email, password });
  return res.json(result);
}

export async function mfaSetup(req: Request, res: Response) {
  const user = (req as any).user as { sub: string } | undefined;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const { otpauthUrl } = await setupMfa(user.sub);
  const dataUrl = await QRCode.toDataURL(otpauthUrl);
  return res.json({ qr: dataUrl });
}

export async function mfaVerify(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, config.jwtSecret) as any;
    if (!payload.mfa) return res.status(400).json({ error: 'Not an MFA token' });
    const { code } = req.body ?? {};
    if (!code) return res.status(400).json({ error: 'Missing code' });
    const { token: finalToken } = await verifyMfaAndIssueToken({ userId: payload.sub, token: code });
    return res.json({ token: finalToken });
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}