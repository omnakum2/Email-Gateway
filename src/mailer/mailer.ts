import * as nodemailer from 'nodemailer';
import { SendMailInput } from './types';
import { defaultTemplate } from './template';

const port = Number(process.env.EMAIL_PORT) || 587;

// One shared transporter for the whole process.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port,
  secure: port === 465, // 465 = implicit TLS, otherwise STARTTLS (e.g. 587)
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
});

// Verify SMTP connection + credentials. Called once at startup to fail fast.
export async function verifyConnection(): Promise<void> {
  await transporter.verify();
}

// Send a single email. Returns the provider message id.
export async function sendMail(input: SendMailInput): Promise<string> {
  const fromName = process.env.DEFAULT_FROM_NAME || 'Email Gateway';
  const html =
    input.html && input.html.trim().length > 0
      ? input.html
      : defaultTemplate(input.subject, input.text);

  const info = await transporter.sendMail({
    from: `${fromName} <${process.env.EMAIL_USER}>`,
    to: input.to,
    cc: input.cc && input.cc.length ? input.cc : undefined,
    bcc: input.bcc && input.bcc.length ? input.bcc : undefined,
    subject: input.subject,
    text: input.text,
    html,
    replyTo: input.replyTo || process.env.DEFAULT_REPLY_TO || undefined,
    attachments: input.attachments,
  });

  return info.messageId;
}
