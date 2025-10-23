import { Notification } from '../models/notification.model.js';
import { getMessaging } from '../config/firebase.js';

export async function registerNotificationToken(userId, token) {
  if (!token) {
    throw new Error('Token required');
  }

  const userModel = Notification.db.model('User');
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.notificationTokens.includes(token)) {
    user.notificationTokens.push(token);
    user.markModified('notificationTokens');
    await user.save();
  }

  return Notification.create({
    user: userId,
    title: 'Device Registered',
    body: 'Notifications enabled on this device.',
  });
}

export async function sendNotification({ user, title, body, metadata }) {
  if (!user.notificationTokens?.length) return;

  const messaging = getMessaging();

  await Notification.create({ user: user._id, title, body, metadata });

  const message = {
    notification: { title, body },
    tokens: user.notificationTokens,
    data: Object.entries(metadata || {}).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {}),
  };

  await messaging.sendEachForMulticast(message);
}
