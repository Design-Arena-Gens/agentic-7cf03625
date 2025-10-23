import { Notification } from '../models/notification.model.js';
import { registerNotificationToken } from '../services/notification.service.js';

export async function listNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ notifications });
  } catch (err) {
    return next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    return res.json({ notification });
  } catch (err) {
    return next(err);
  }
}

export async function registerToken(req, res, next) {
  try {
    const { token } = req.body;
    await registerNotificationToken(req.user._id, token);
    return res.status(201).json({ message: 'Token registered' });
  } catch (err) {
    return next(err);
  }
}
