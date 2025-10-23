import { Router } from 'express';
import { register, login, socialLogin, me } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/social', socialLogin);
router.get('/me', authenticate, me);

export default router;
