import 'dotenv/config';
import { setDefaultResultOrder, setServers } from 'node:dns';
// Override ISP DNS (blocks MongoDB SRV records) with Cloudflare's resolver
setServers(['1.1.1.1', '8.8.8.8']);
setDefaultResultOrder('ipv4first');
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import contactRouter from './routes/contact';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT ?? 3001;
const MONGODB_URI = process.env.MONGODB_URI ?? '';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

// ── Security middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }),
);

// ── Rate limiting: 20 requests / 15 min per IP ───────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(StatusCodes.OK).json({ success: true, message: 'Server is healthy.', uptime: process.uptime() });
});

app.use('/api/contact', contactRouter);

// ── 404 fallback ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Route not found.' });
});

// ── Error handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

// ── Database + server start ──────────────────────────────────────────────────
async function start() {
  // Always start the HTTP server first so health checks work immediately
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
    // Log but don't crash — contact route returns 500 if DB is down
    console.error('MongoDB connection failed:', err);
  }
}

start().catch((err: unknown) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
