import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';


import unifiedSearchRouter from "./routes/unifiedRoute.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// connect DB
connectDB();

// routes
app.get('/', (req, res) => res.json({ ok: true, message: 'Fashion Search Backend (Phase 1)'}));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use("/api/search", unifiedSearchRouter);


// error fallback
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
