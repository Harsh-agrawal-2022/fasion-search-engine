// src/scripts/seed.js
import dotenv from 'dotenv';
dotenv.config()
import mongoose from 'mongoose';

import Product from '../models/Product.js';
import products from '../data/products.js';
import connectDB from '../config/db.js';

async function run() {
  try {
    await connectDB();
    console.log('Connected to DB. Seeding products...');
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('✅ Seeded 100 products');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}
run();
