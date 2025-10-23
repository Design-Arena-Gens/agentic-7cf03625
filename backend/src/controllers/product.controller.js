import { Product } from '../models/product.model.js';

export async function createProduct(req, res, next) {
  try {
    if (!req.user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const product = await Product.create(req.body);
    return res.status(201).json({ product });
  } catch (err) {
    return next(err);
  }
}

export async function listProducts(req, res, next) {
  try {
    const products = await Product.find({ isActive: true }).lean();
    return res.json({ products });
  } catch (err) {
    return next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    if (!req.user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { productId } = req.params;
    const product = await Product.findByIdAndUpdate(productId, req.body, { new: true });
    return res.json({ product });
  } catch (err) {
    return next(err);
  }
}

export async function deactivateProduct(req, res, next) {
  try {
    if (!req.user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { productId } = req.params;
    const product = await Product.findByIdAndUpdate(
      productId,
      { isActive: false },
      { new: true }
    );
    return res.json({ product });
  } catch (err) {
    return next(err);
  }
}
