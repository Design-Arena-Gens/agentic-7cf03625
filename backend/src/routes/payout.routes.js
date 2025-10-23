import { Router } from 'express';
import {
  requestPayout,
  listPayouts,
  adminListPayouts,
  updatePayoutStatus,
} from '../controllers/payout.controller.js';

const router = Router();

router.post('/', requestPayout);
router.get('/', listPayouts);
router.get('/admin', adminListPayouts);
router.patch('/:payoutId', updatePayoutStatus);

export default router;
