"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.authenticateUser = authenticateUser;
exports.setupMfa = setupMfa;
exports.verifyMfaAndIssueToken = verifyMfaAndIssueToken;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../db");
const jwt_1 = require("../utils/jwt");
const speakeasy_1 = __importDefault(require("speakeasy"));
async function registerUser(params) {
    const { email, password, name } = params;
    const role = params.role ?? 'EMPLOYEE';
    const existing = await db_1.prisma.user.findUnique({ where: { email } });
    if (existing)
        throw Object.assign(new Error('Email already in use'), { status: 400 });
    const passwordHash = await bcrypt_1.default.hash(password, 12);
    const user = await db_1.prisma.user.create({ data: { email, passwordHash, name, role } });
    return { id: user.id, email: user.email, name: user.name, role: user.role };
}
async function authenticateUser(params) {
    const { email, password } = params;
    const user = await db_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const ok = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!ok)
        throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    if (user.mfaEnabled) {
        const tempToken = (0, jwt_1.signToken)(user.id, user.role, { mfa: true, expiresInSeconds: 600 });
        return { mfaRequired: true, tempToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
    }
    const token = (0, jwt_1.signToken)(user.id, user.role);
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}
async function setupMfa(userId) {
    const secret = speakeasy_1.default.generateSecret({ length: 20, name: `EMS (${userId})` });
    await db_1.prisma.user.update({ where: { id: userId }, data: { mfaSecret: secret.base32 } });
    return { otpauthUrl: secret.otpauth_url, base32: secret.base32 };
}
async function verifyMfaAndIssueToken(params) {
    const user = await db_1.prisma.user.findUnique({ where: { id: params.userId } });
    if (!user || !user.mfaSecret)
        throw Object.assign(new Error('MFA not configured'), { status: 400 });
    const valid = speakeasy_1.default.totp.verify({ secret: user.mfaSecret, encoding: 'base32', token: params.token, window: 1 });
    if (!valid)
        throw Object.assign(new Error('Invalid MFA code'), { status: 401 });
    await db_1.prisma.user.update({ where: { id: user.id }, data: { mfaEnabled: true } });
    return { token: (0, jwt_1.signToken)(user.id, user.role) };
}
//# sourceMappingURL=userService.js.map