import { setDefaultResultOrder, setServers } from 'node:dns';
setServers(['1.1.1.1', '8.8.8.8']);
setDefaultResultOrder('ipv4first');

import mongoose from 'mongoose';
import { app } from './app';

const PORT = process.env.PORT ?? 3001;
const MONGODB_URI = process.env.MONGODB_URI ?? '';

async function start() {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  if (!MONGODB_URI) {
    console.warn('MONGODB_URI not set — contact form will not persist.');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 30000,
    });
    console.log('MongoDB connected.');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
  }
}

start().catch((err: unknown) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
