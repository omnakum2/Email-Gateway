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
publicEmailRouter.options('/public-send', publicCors);

// POST /public-send — contact-form endpoint safe for direct browser calls.
// The recipient is ALWAYS the server-configured PUBLIC_TO; callers cannot set it,
// so a leaked public key can never be used as an open relay to arbitrary addresses.
// Accepts only: text (required), subject (optional), replyTo (optional, the lead's email).
publicEmailRouter.post(
  '/public-send',
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
      const replyTo: string | undefined = req.body.replyTo;

      if (!text || !text.trim()) {
        return fail(res, 400, 'A message `text` is required');
      }
      if (replyTo && !isEmail(replyTo)) {
        return fail(res, 400, '`replyTo` must be a valid email address');
      }

      // No caller-supplied `to`/`html`/attachments: the gateway renders the
      // message with its own default template and mails it to PUBLIC_TO.
      const messageId = await sendMail({ to, subject, text, replyTo });
      return ok(res, { messageId });
    } catch (err: any) {
      return fail(res, 500, err?.message || 'Failed to send email');
    }
  },
);
