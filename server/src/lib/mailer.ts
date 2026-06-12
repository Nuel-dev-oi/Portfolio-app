import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export interface MailPayload {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(payload: MailPayload): Promise<void> {
  const { senderName, senderEmail, subject, message } = payload;

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: senderEmail,
    subject: `[Portfolio] ${subject}`,
    text: `From: ${senderName} <${senderEmail}>\n\n${message}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#3b82f6;margin-bottom:4px">New portfolio message</h2>
        <p style="color:#64748b;font-size:13px;margin-top:0">via emmanuelokoro273.dev</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0"/>
        <table style="width:100%;font-size:14px">
          <tr><td style="color:#64748b;width:80px">Name</td><td>${senderName}</td></tr>
          <tr><td style="color:#64748b">Email</td><td><a href="mailto:${senderEmail}">${senderEmail}</a></td></tr>
          <tr><td style="color:#64748b">Subject</td><td>${subject}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0"/>
        <p style="font-size:14px;white-space:pre-wrap">${message.replace(/</g, '&lt;')}</p>
      </div>
    `,
  });
}