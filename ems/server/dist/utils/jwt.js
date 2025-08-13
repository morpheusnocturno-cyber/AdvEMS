"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const signToken = (userId, role, opts) => {
    const payload = { sub: userId, role, mfa: opts?.mfa ?? false };
    const secret = env_1.config.jwtSecret;
    const expiresIn = opts?.expiresInSeconds ?? (opts?.mfa ? 600 : 604800);
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.signToken = signToken;
//# sourceMappingURL=jwt.js.map