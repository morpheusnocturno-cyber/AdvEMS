import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getMine, postClockIn, postClockOut } from '../controllers/attendanceController';

const router = Router();
router.use(authenticate(true));
router.get('/me', (req, res, next) => void getMine(req, res).catch(next));
router.post('/clock-in', (req, res, next) => void postClockIn(req, res).catch(next));
router.post('/clock-out', (req, res, next) => void postClockOut(req, res).catch(next));

export default router;