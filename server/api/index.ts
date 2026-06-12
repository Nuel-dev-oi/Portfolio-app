import mongoose from 'mongoose';
import { app } from '../src/app';

// Reuse the connection across warm invocations
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI ?? '';
  if (!uri) return;
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 30000,
  });
  isConnected = true;
}

connectDB().catch((err) => console.error('MongoDB connection failed:', err));

export default app;
