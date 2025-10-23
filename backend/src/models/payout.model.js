import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'failed'],
      default: 'pending',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Payout = mongoose.model('Payout', payoutSchema);
