import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export default async function connectDB() {

  try {
    await mongoose.connect('mongodb://localhost:27017/fashiondb', { dbName: 'fashiondb' });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
}
