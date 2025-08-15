"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getEnv = (key, fallback) => {
    const value = process.env[key];
    if (value === undefined || value === '') {
        if (fallback !== undefined)
            return fallback;
        throw new Error(`Missing required env var ${key}`);
    }
    return value;
};
exports.config = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 4000),
    jwtSecret: getEnv('JWT_SECRET', 'devsecret-change-me'),
    corsOrigin: (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(','),
    enableMfa: (process.env.ENABLE_MFA ?? 'true') === 'true',
};
//# sourceMappingURL=env.js.map