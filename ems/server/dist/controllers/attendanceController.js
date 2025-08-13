"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMine = getMine;
exports.postClockIn = postClockIn;
exports.postClockOut = postClockOut;
const attendanceService_1 = require("../services/attendanceService");
async function getMine(req, res) {
    const user = req.user;
    const entries = await (0, attendanceService_1.listMyAttendance)(user.sub);
    res.json({ entries });
}
async function postClockIn(req, res) {
    const user = req.user;
    const { latitude, longitude } = req.body ?? {};
    const entry = await (0, attendanceService_1.clockIn)(user.sub, { latitude, longitude });
    res.status(201).json({ entry });
}
async function postClockOut(req, res) {
    const user = req.user;
    const { latitude, longitude } = req.body ?? {};
    const entry = await (0, attendanceService_1.clockOut)(user.sub, { latitude, longitude });
    res.json({ entry });
}
//# sourceMappingURL=attendanceController.js.map