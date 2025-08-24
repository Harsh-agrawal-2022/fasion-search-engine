import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  brand: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, index: true },
  rating: { type: Number, default: 4.0 },
  occasion: { type: String, index: true }, // Party | Wedding | Office | Casual | Birthday | Sports | Festive
  features: [{ type: String }],
  sizes: [{ type: String }],
  colors: [{ type: String }],
  stock: { type: Number, default: 10 },
  img: { type: String },
  description: { type: String }
}, { timestamps: true });

// text index for search
productSchema.index({ name: 'text', brand: 'text', category: 'text', description: 'text', features: 'text' });

export default mongoose.model('Product', productSchema);
