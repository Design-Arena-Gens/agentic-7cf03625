import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const socialSchema = new mongoose.Schema({
  provider: { type: String },
  providerId: { type: String },
});

const earningsSchema = new mongoose.Schema(
  {
    totalSales: { type: Number, default: 0 },
    totalCommissions: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    passwordHash: { type: String },
    affiliateId: { type: String, unique: true },
    sponsor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    roles: { type: [String], default: ['affiliate'] },
    earnings: {
      type: earningsSchema,
      default: () => ({ totalSales: 0, totalCommissions: 0, balance: 0 }),
    },
    socialAccounts: { type: [socialSchema], default: [] },
    stripeCustomerId: { type: String },
    notificationTokens: { type: [String], default: [] },
    verification: {
      emailVerified: { type: Boolean, default: false },
      phoneVerified: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function preSave(next) {
  if (!this.affiliateId) {
    this.affiliateId = `NW-${uuidv4().split('-')[0].toUpperCase()}`;
  }
  next();
});

userSchema.virtual('fullName').get(function fullName() {
  return `${this.firstName} ${this.lastName}`.trim();
});

export const User = mongoose.model('User', userSchema);
