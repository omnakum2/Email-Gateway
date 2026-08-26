import { Router } from 'express';
import { fail, ok } from '../utils/http';
import { isEmail } from '../utils/validation';
import { sendMail } from '../mailer/mailer';
import { publicCors } from '../middleware/publicCors';
import { publicKeyGuard } from '../middleware/publicKey';
import { publicRateLimiter } from '../middleware/rateLimit';
import { requireEnabled } from '../middleware/toggle';

export const publicEmailRouter = Router();

// CORS preflight for the browser.
publicEmailRouter.options('/send-public-email', publicCors);

// POST /send-public-email — contact-form endpoint safe for direct browser calls.
// The recipient is ALWAYS the server-configured PUBLIC_TO; callers cannot set it,
// so a leaked public key can never be used as an open relay to arbitrary addresses.
// Accepts only: text (required), subject (optional).
publicEmailRouter.post(
  '/send-public-email',
  publicCors,
  requireEnabled('PUBLIC_SEND_ENABLED'),
  publicRateLimiter,
  publicKeyGuard,
  async (req, res) => {
    try {
      const to = process.env.PUBLIC_TO || '';
      if (!to) {
        return fail(res, 500, 'PUBLIC_TO is not configured on the server');
      }

      const text: string | undefined = req.body.text;
      const subject: string = (req.body.subject || 'New contact form submission').trim();

      if (!text || !text.trim()) {
        return fail(res, 400, 'A message `text` is required');
      }
      // No caller-supplied `to`/`html`/attachments: the gateway renders the
      // message with its own default template and mails it to PUBLIC_TO.
      const messageId = await sendMail({ to, subject, text });
      return ok(res, { messageId });
    } catch (err: any) {
      return fail(res, 500, err?.message || 'Failed to send email');
    }
  },
);
