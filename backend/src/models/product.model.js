import mongoose from 'mongoose';

const priceTierSchema = new mongoose.Schema(
  {
    level: { type: Number, required: true },
    commissionRate: { type: Number, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    mediaUrl: { type: String },
    price: { type: Number, required: true },
    type: { type: String, enum: ['digital', 'physical'], default: 'digital' },
    sku: { type: String, unique: true },
    inventory: { type: Number, default: 0 },
    commissionStructure: { type: [priceTierSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
