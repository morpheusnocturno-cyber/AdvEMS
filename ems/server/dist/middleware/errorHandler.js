"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    const status = err?.status ?? 500;
    const message = err?.message ?? 'Internal Server Error';
    res.status(status).json({ error: message });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map