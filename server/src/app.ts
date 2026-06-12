import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';
import contactRouter from './routes/contact';
import { errorHandler } from './middleware/errorHandler';

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => {
  res.status(StatusCodes.OK).json({ success: true, message: 'Server is healthy.', uptime: process.uptime() });
});

app.use('/api/contact', contactRouter);

app.use((_req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Route not found.' });
});

app.use(errorHandler);
