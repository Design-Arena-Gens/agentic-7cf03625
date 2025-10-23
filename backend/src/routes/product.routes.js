import { Router } from 'express';
import {
  createProduct,
  listProducts,
  updateProduct,
  deactivateProduct,
} from '../controllers/product.controller.js';

const router = Router();

router.get('/', listProducts);
router.post('/', createProduct);
router.patch('/:productId', updateProduct);
router.delete('/:productId', deactivateProduct);

export default router;
