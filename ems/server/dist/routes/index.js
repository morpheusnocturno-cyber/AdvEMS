"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const authRoutes_1 = __importDefault(require("./authRoutes"));
const attendanceRoutes_1 = __importDefault(require("./attendanceRoutes"));
const auth_1 = require("../middleware/auth");
function registerRoutes(app) {
    app.use('/api/auth', authRoutes_1.default);
    app.use('/api/attendance', attendanceRoutes_1.default);
    // Example protected route
    app.get('/api/me', (0, auth_1.authenticate)(true), (req, res) => {
        res.json({ user: req.user });
    });
    // Placeholders for core modules
    app.get('/api/leave', (0, auth_1.authenticate)(true), (_req, res) => res.json({ leaves: [] }));
    app.get('/api/payroll/payslips', (0, auth_1.authenticate)(true), (_req, res) => res.json({ payslips: [] }));
    app.get('/api/performance/goals', (0, auth_1.authenticate)(true), (_req, res) => res.json({ goals: [] }));
    app.get('/api/tasks', (0, auth_1.authenticate)(true), (_req, res) => res.json({ tasks: [] }));
    app.get('/api/documents', (0, auth_1.authenticate)(true), (_req, res) => res.json({ documents: [] }));
    app.get('/api/notifications', (0, auth_1.authenticate)(true), (_req, res) => res.json({ notifications: [] }));
    // Admin-only example route
    app.get('/api/admin/reports', (0, auth_1.authenticate)(true), (0, auth_1.requireRoles)(['ADMIN']), (_req, res) => res.json({ reports: [] }));
}
//# sourceMappingURL=index.js.map