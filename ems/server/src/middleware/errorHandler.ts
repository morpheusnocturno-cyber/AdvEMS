import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = (err as any)?.status ?? 500;
  const message = (err as any)?.message ?? 'Internal Server Error';
  res.status(status).json({ error: message });
};