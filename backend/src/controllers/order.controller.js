import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';
import { ensureCustomer, createPaymentIntent } from '../services/stripe.service.js';
import { calculateCommissions } from '../services/commission.service.js';

export async function createOrder(req, res, next) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: 'Order items required' });
    }

    const products = await Product.find({ _id: { $in: items.map((i) => i.productId) } });
    const user = await User.findById(req.user._id);
    const stripeCustomerId = await ensureCustomer(user);
    user.stripeCustomerId = stripeCustomerId;
    await user.save();

    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) {
        const error = new Error('Product not found');
        error.status = 404;
        throw error;
      }
      const quantity = item.quantity || 1;
      const unitPrice = product.price;
      return {
        product: product._id,
        quantity,
        unitPrice,
        commission: 0,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    const paymentIntent = await createPaymentIntent({
      amount: totalAmount,
      customerId: stripeCustomerId,
      metadata: { userId: user._id.toString() },
    });

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      totalAmount,
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
    });

    return res.status(201).json({
      order,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    return next(err);
  }
}

export async function confirmOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'paid') {
      return res.json({ order });
    }

    order.status = 'paid';

    const buyer = await User.findById(order.user);
    const levels = await calculateCommissions({ buyer, totalAmount: order.totalAmount });
    order.levelCommissions = levels;
    await order.save();

    buyer.earnings.totalSales += order.totalAmount;
    buyer.markModified('earnings');
    await buyer.save();

    return res.json({ order });
  } catch (err) {
    return next(err);
  }
}

export async function listOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .populate('levelCommissions.user', 'firstName lastName affiliateId')
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ orders });
  } catch (err) {
    return next(err);
  }
}
