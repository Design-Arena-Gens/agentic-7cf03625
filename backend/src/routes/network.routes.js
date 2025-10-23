import { Router } from 'express';
import { getTree, getStats } from '../controllers/network.controller.js';

const router = Router();

router.get('/tree', getTree);
router.get('/stats', getStats);

export default router;
