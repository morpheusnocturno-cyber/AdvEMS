"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const attendanceController_1 = require("../controllers/attendanceController");
const router = (0, express_1.Router)();
router.use((0, auth_1.authenticate)(true));
router.get('/me', (req, res, next) => void (0, attendanceController_1.getMine)(req, res).catch(next));
router.post('/clock-in', (req, res, next) => void (0, attendanceController_1.postClockIn)(req, res).catch(next));
router.post('/clock-out', (req, res, next) => void (0, attendanceController_1.postClockOut)(req, res).catch(next));
exports.default = router;
//# sourceMappingURL=attendanceRoutes.js.map