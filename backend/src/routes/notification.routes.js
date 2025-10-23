import { Router } from 'express';
import { listNotifications, markAsRead, registerToken } from '../controllers/notification.controller.js';

const router = Router();

router.get('/', listNotifications);
router.post('/register', registerToken);
router.patch('/:notificationId/read', markAsRead);

export default router;
