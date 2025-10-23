import { User } from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { ensureCustomer } from '../services/stripe.service.js';

export async function register(req, res, next) {
  try {
    const { firstName, lastName, email, phone, password, sponsorAffiliateId } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Account already exists' });
    }

    const sponsor = sponsorAffiliateId
      ? await User.findOne({ affiliateId: sponsorAffiliateId })
      : null;

    const passwordHash = password ? await hashPassword(password) : undefined;

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      sponsor: sponsor?._id,
    });

    user.stripeCustomerId = await ensureCustomer(user);
    await user.save();

    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        affiliateId: user.affiliateId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        affiliateId: user.affiliateId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function socialLogin(req, res, next) {
  try {
    const { provider, providerId, email, firstName, lastName } = req.body;

    if (!provider || !providerId || !email) {
      return res.status(400).json({ message: 'Social credentials missing' });
    }

    let user = await User.findOne({
      $or: [
        { email },
        {
          socialAccounts: {
            $elemMatch: { provider, providerId },
          },
        },
      ],
    });

    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        email,
        roles: ['affiliate'],
        socialAccounts: [{ provider, providerId }],
      });
    } else if (
      !user.socialAccounts.some(
        (account) => account.provider === provider && account.providerId === providerId
      )
    ) {
      user.socialAccounts.push({ provider, providerId });
      user.markModified('socialAccounts');
      await user.save();
    }

    const token = generateToken(user);
    return res.json({ token, user: { id: user._id, affiliateId: user.affiliateId, email: user.email } });
  } catch (err) {
    return next(err);
  }
}

export async function me(req, res) {
  const user = await User.findById(req.user._id)
    .select('-passwordHash')
    .lean();
  return res.json({ user });
}
