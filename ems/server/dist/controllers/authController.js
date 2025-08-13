"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.mfaSetup = mfaSetup;
exports.mfaVerify = mfaVerify;
const qrcode_1 = __importDefault(require("qrcode"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const userService_1 = require("../services/userService");
async function register(req, res) {
    const { email, password, name, role } = req.body ?? {};
    if (!email || !password || !name)
        return res.status(400).json({ error: 'Missing required fields' });
    const user = await (0, userService_1.registerUser)({ email, password, name, role });
    return res.status(201).json({ user });
}
async function login(req, res) {
    const { email, password } = req.body ?? {};
    if (!email || !password)
        return res.status(400).json({ error: 'Missing credentials' });
    const result = await (0, userService_1.authenticateUser)({ email, password });
    return res.json(result);
}
async function mfaSetup(req, res) {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: 'Unauthorized' });
    const { otpauthUrl } = await (0, userService_1.setupMfa)(user.sub);
    const dataUrl = await qrcode_1.default.toDataURL(otpauthUrl);
    return res.json({ qr: dataUrl });
}
async function mfaVerify(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret);
        if (!payload.mfa)
            return res.status(400).json({ error: 'Not an MFA token' });
        const { code } = req.body ?? {};
        if (!code)
            return res.status(400).json({ error: 'Missing code' });
        const { token: finalToken } = await (0, userService_1.verifyMfaAndIssueToken)({ userId: payload.sub, token: code });
        return res.json({ token: finalToken });
    }
    catch {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
//# sourceMappingURL=authController.js.map