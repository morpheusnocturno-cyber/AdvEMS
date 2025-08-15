import type { Express, Request, Response } from 'express';
import authRoutes from './authRoutes';
import attendanceRoutes from './attendanceRoutes';
import { authenticate, requireRoles } from '../middleware/auth';

export function registerRoutes(app: Express) {
  app.use('/api/auth', authRoutes);
  app.use('/api/attendance', attendanceRoutes);

  // Example protected route
  app.get('/api/me', authenticate(true), (req: Request, res: Response) => {
    res.json({ user: (req as any).user });
  });

  // Placeholders for core modules
  app.get('/api/leave', authenticate(true), (_req, res) => res.json({ leaves: [] }));
  app.get('/api/payroll/payslips', authenticate(true), (_req, res) => res.json({ payslips: [] }));
  app.get('/api/performance/goals', authenticate(true), (_req, res) => res.json({ goals: [] }));
  app.get('/api/tasks', authenticate(true), (_req, res) => res.json({ tasks: [] }));
  app.get('/api/documents', authenticate(true), (_req, res) => res.json({ documents: [] }));
  app.get('/api/notifications', authenticate(true), (_req, res) => res.json({ notifications: [] }));

  // Admin-only example route
  app.get('/api/admin/reports', authenticate(true), requireRoles(['ADMIN']), (_req, res) => res.json({ reports: [] }));
}