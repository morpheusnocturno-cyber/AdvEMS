"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRoles = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const authenticate = (requireFullAuth = true) => (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const tokenFromHeader = authHeader?.startsWith('Bearer ')
            ? authHeader.substring('Bearer '.length)
            : undefined;
        const token = tokenFromHeader ?? req.cookies?.token;
        if (!token) {
            if (requireFullAuth)
                return res.status(401).json({ error: 'Unauthorized' });
            req.user = undefined;
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret);
        if (requireFullAuth && decoded.mfa) {
            return res.status(401).json({ error: 'MFA required' });
        }
        req.user = decoded;
        return next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
exports.authenticate = authenticate;
const requireRoles = (roles) => (req, res, next) => {
    const user = req.user;
    if (!user || !roles.includes(user.role))
        return res.status(403).json({ error: 'Forbidden' });
    return next();
};
exports.requireRoles = requireRoles;
//# sourceMappingURL=auth.js.map