"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const routes_1 = require("./routes");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.set('trust proxy', 1);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.config.corsOrigin, credentials: true }));
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
const limiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7' });
app.use(limiter);
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'ems-api', version: '0.1.0' });
});
(0, routes_1.registerRoutes)(app);
app.use(errorHandler_1.errorHandler);
server.listen(env_1.config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env_1.config.port}`);
});
//# sourceMappingURL=index.js.map