import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { ContactMessage } from '../models/ContactMessage';
import { sendContactEmail } from '../lib/mailer';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: firstIssue?.message ?? 'Invalid request data.',
    });
    return;
  }

  const { name, email, subject, message } = parsed.data;

  // Persist to DB (best-effort — don't block the response on it)
  ContactMessage.create(parsed.data).catch((err: unknown) => {
    console.error('DB save failed:', err);
  });

  // Send email notification
  await sendContactEmail({ senderName: name, senderEmail: email, subject, message });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Message received. I will get back to you soon.',
  });
});

export default router;
