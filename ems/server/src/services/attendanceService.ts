import { prisma } from '../db';

export async function getOpenAttendance(userId: string) {
  return prisma.attendance.findFirst({ where: { userId, clockOut: null }, orderBy: { clockIn: 'desc' } });
}

export async function clockIn(userId: string, coords?: { latitude?: number; longitude?: number }) {
  const open = await getOpenAttendance(userId);
  if (open) throw Object.assign(new Error('Already clocked in'), { status: 400 });
  const entry = await prisma.attendance.create({
    data: {
      userId,
      clockIn: new Date(),
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
    },
  });
  return entry;
}

export async function clockOut(userId: string, coords?: { latitude?: number; longitude?: number }) {
  const open = await getOpenAttendance(userId);
  if (!open) throw Object.assign(new Error('Not clocked in'), { status: 400 });
  const entry = await prisma.attendance.update({
    where: { id: open.id },
    data: { clockOut: new Date(), latitude: coords?.latitude ?? open.latitude ?? null, longitude: coords?.longitude ?? open.longitude ?? null },
  });
  return entry;
}

export async function listMyAttendance(userId: string, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return prisma.attendance.findMany({ where: { userId, clockIn: { gte: since } }, orderBy: { clockIn: 'desc' } });
}