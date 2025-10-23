import { Payout } from '../models/payout.model.js';
import { User } from '../models/user.model.js';

export async function requestPayout(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const { amount } = req.body;

    if (amount > user.earnings.balance) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.earnings.balance -= amount;
    user.markModified('earnings');
    await user.save();

    const payout = await Payout.create({ user: user._id, amount });
    return res.status(201).json({ payout });
  } catch (err) {
    return next(err);
  }
}

export async function listPayouts(req, res, next) {
  try {
    const payouts = await Payout.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    return res.json({ payouts });
  } catch (err) {
    return next(err);
  }
}

export async function adminListPayouts(req, res, next) {
  try {
    if (!req.user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const payouts = await Payout.find().populate('user', 'firstName lastName affiliateId').lean();
    return res.json({ payouts });
  } catch (err) {
    return next(err);
  }
}

export async function updatePayoutStatus(req, res, next) {
  try {
    if (!req.user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { payoutId } = req.params;
    const payout = await Payout.findByIdAndUpdate(payoutId, req.body, { new: true });
    return res.json({ payout });
  } catch (err) {
    return next(err);
  }
}
