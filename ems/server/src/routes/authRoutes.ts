import { Router } from 'express';
import { login, register, mfaSetup, mfaVerify } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', (req, res, next) => void register(req, res).catch(next));
router.post('/login', (req, res, next) => void login(req, res).catch(next));
router.post('/mfa/setup', authenticate(true), (req, res, next) => void mfaSetup(req, res).catch(next));
router.post('/mfa/verify', (req, res, next) => void mfaVerify(req, res).catch(next));

export default router;