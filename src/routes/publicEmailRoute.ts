import { Router } from 'express';
import { fail, ok } from '../utils/http';
import { sendMail } from '../mailer/mailer';
import { publicCors } from '../middleware/publicCors';
import { publicKeyGuard } from '../middleware/publicKey';
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
  publicKeyGuard,
  async (req, res) => {
    try {
      const to = process.env.PUBLIC_TO || '';
      if (!to) {
        return fail(res, 500, 'PUBLIC_TO is not configured on the server');
      }

      const html: string | undefined = req.body.html;
      const text: string | undefined = req.body.text;
      const subject: string = (req.body.subject || 'New contact form submission').trim();

      const messageId = await sendMail({ to, subject, html, text });
      return ok(res, { messageId });
    } catch (err: any) {
      return fail(res, 500, err?.message || 'Failed to send email');
    }
  },
);
