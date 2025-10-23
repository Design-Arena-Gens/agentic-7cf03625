import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    commission: { type: Number, default: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'fulfilled', 'refunded'],
      default: 'pending',
    },
    stripePaymentIntentId: { type: String },
    levelCommissions: [
      {
        level: Number,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount: Number,
      },
    ],
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
