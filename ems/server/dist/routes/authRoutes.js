"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/register', (req, res, next) => void (0, authController_1.register)(req, res).catch(next));
router.post('/login', (req, res, next) => void (0, authController_1.login)(req, res).catch(next));
router.post('/mfa/setup', (0, auth_1.authenticate)(true), (req, res, next) => void (0, authController_1.mfaSetup)(req, res).catch(next));
router.post('/mfa/verify', (req, res, next) => void (0, authController_1.mfaVerify)(req, res).catch(next));
exports.default = router;
//# sourceMappingURL=authRoutes.js.map