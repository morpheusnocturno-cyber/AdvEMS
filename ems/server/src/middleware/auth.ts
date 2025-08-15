import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import type { Role } from '@prisma/client';

export interface AuthTokenPayload {
  sub: string;
  role: Role;
  mfa?: boolean; // indicates this token is a temporary token awaiting MFA
}

export const authenticate = (requireFullAuth = true) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
      ? authHeader.substring('Bearer '.length)
      : undefined;
    const token = tokenFromHeader ?? (req.cookies?.token as string | undefined);
    if (!token) {
      if (requireFullAuth) return res.status(401).json({ error: 'Unauthorized' });
      (req as any).user = undefined;
      return next();
    }
    const decoded = jwt.verify(token, config.jwtSecret) as AuthTokenPayload;
    if (requireFullAuth && decoded.mfa) {
      return res.status(401).json({ error: 'MFA required' });
    }
    (req as any).user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const requireRoles = (roles: Role[]) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user as AuthTokenPayload | undefined;
  if (!user || !roles.includes(user.role)) return res.status(403).json({ error: 'Forbidden' });
  return next();
};