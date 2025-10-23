import { User } from '../models/user.model.js';

const DEFAULT_LEVELS = [0.2, 0.1, 0.05];

export async function calculateCommissions({ buyer, totalAmount }) {
  const levels = [];
  let currentSponsorId = buyer.sponsor;
  let levelIndex = 0;

  while (currentSponsorId && levelIndex < DEFAULT_LEVELS.length) {
    // eslint-disable-next-line no-await-in-loop
    const sponsor = await User.findById(currentSponsorId);
    if (!sponsor) break;

    const commissionRate = DEFAULT_LEVELS[levelIndex];
    const commissionAmount = totalAmount * commissionRate;

    sponsor.earnings.totalCommissions += commissionAmount;
    sponsor.earnings.balance += commissionAmount;
    sponsor.markModified('earnings');
    // eslint-disable-next-line no-await-in-loop
    await sponsor.save();

    levels.push({
      level: levelIndex + 1,
      user: sponsor._id,
      amount: commissionAmount,
    });

    currentSponsorId = sponsor.sponsor;
    levelIndex += 1;
  }

  return levels;
}
