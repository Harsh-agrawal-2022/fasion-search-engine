import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // Use 'name' as the primary field for consistency.
  name: { type: String, required: true, index: true },
  brand: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, index: true },
  
  // --- CORRECTED RATING SCHEMA ---
  // This structure handles the nested object: { "rate": 4.7, "count": 680 }
  rating: {
    rate: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  
  // --- LEGACY FIELDS for old data ---
  // These will hold the old `avg_rating` and `ratingCount` values.
  avg_rating: { type: Number },
  ratingCount: { type: Number },

  description: { type: String },
  img: { type: String }, // Use 'img' to match your data
  colors: [{ type: String }],
  availableSizes: [{ type: String }],
  tags: [{ type: String }],
  stock: { type: Number, default: 10 },
  
}, { timestamps: true });

// A text index is crucial for the fuzzy search to work.
// Ensure this index is created on your MongoDB collection.
productSchema.index({ 
    name: 'text', 
    brand: 'text', 
    category: 'text', 
    description: 'text', 
    tags: 'text' 
});

export default mongoose.model('Product', productSchema);
