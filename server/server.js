import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectMongoDB from './config/mongodb.js';
import { connectSupabase } from './config/supabase.js';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB always connects — used in both environments
await connectMongoDB();
// Supabase only connects when NODE_ENV=production
connectSupabase();

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// The React app calls this to know which env it is in
app.get('/api/env', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || 'development',
    authEnabled: process.env.NODE_ENV === 'production',
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📦 Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 Auth (Supabase): ${process.env.NODE_ENV === 'production' ? 'enabled' : 'disabled'}\n`);
});
