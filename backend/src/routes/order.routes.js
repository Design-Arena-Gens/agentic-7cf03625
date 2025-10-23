import { Router } from 'express';
import { createOrder, confirmOrder, listOrders } from '../controllers/order.controller.js';

const router = Router();

router.post('/', createOrder);
router.post('/:orderId/confirm', confirmOrder);
router.get('/', listOrders);

export default router;
