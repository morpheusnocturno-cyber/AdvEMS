"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenAttendance = getOpenAttendance;
exports.clockIn = clockIn;
exports.clockOut = clockOut;
exports.listMyAttendance = listMyAttendance;
const db_1 = require("../db");
async function getOpenAttendance(userId) {
    return db_1.prisma.attendance.findFirst({ where: { userId, clockOut: null }, orderBy: { clockIn: 'desc' } });
}
async function clockIn(userId, coords) {
    const open = await getOpenAttendance(userId);
    if (open)
        throw Object.assign(new Error('Already clocked in'), { status: 400 });
    const entry = await db_1.prisma.attendance.create({
        data: {
            userId,
            clockIn: new Date(),
            latitude: coords?.latitude ?? null,
            longitude: coords?.longitude ?? null,
        },
    });
    return entry;
}
async function clockOut(userId, coords) {
    const open = await getOpenAttendance(userId);
    if (!open)
        throw Object.assign(new Error('Not clocked in'), { status: 400 });
    const entry = await db_1.prisma.attendance.update({
        where: { id: open.id },
        data: { clockOut: new Date(), latitude: coords?.latitude ?? open.latitude ?? null, longitude: coords?.longitude ?? open.longitude ?? null },
    });
    return entry;
}
async function listMyAttendance(userId, days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return db_1.prisma.attendance.findMany({ where: { userId, clockIn: { gte: since } }, orderBy: { clockIn: 'desc' } });
}
//# sourceMappingURL=attendanceService.js.map