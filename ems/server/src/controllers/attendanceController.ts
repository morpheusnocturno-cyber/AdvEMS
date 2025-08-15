import type { Request, Response } from 'express';
import { clockIn, clockOut, listMyAttendance } from '../services/attendanceService';

export async function getMine(req: Request, res: Response) {
  const user = (req as any).user as { sub: string };
  const entries = await listMyAttendance(user.sub);
  res.json({ entries });
}

export async function postClockIn(req: Request, res: Response) {
  const user = (req as any).user as { sub: string };
  const { latitude, longitude } = req.body ?? {};
  const entry = await clockIn(user.sub, { latitude, longitude });
  res.status(201).json({ entry });
}

export async function postClockOut(req: Request, res: Response) {
  const user = (req as any).user as { sub: string };
  const { latitude, longitude } = req.body ?? {};
  const entry = await clockOut(user.sub, { latitude, longitude });
  res.json({ entry });
}