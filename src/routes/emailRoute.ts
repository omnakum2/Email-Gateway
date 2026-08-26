import { Router } from 'express';
import multer from 'multer';
import * as path from 'path';
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE, MAX_ATTACHMENT_COUNT } from '../constants';
import { fail, ok } from '../utils/http';
import { isEmail, toArray } from '../utils/validation';
import { sendMail } from '../mailer/mailer';
import { Attachment } from '../mailer/types';
import { rateLimiter } from '../middleware/rateLimit';
import { apiKeyGuard } from '../middleware/apiKey';
import { requireEnabled } from '../middleware/toggle';

// Attachments held in memory (never written to disk), with size + count caps.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_ATTACHMENT_COUNT },
});

export const emailRouter = Router();

// POST /send-email — secret, server-to-server. Send one email to any recipient,
// with optional attachments. Accepts multipart/form-data or application/json.
// Rate-limited first (throttles brute force), then requires the secret API key.
emailRouter.post(
  '/send-email',
  requireEnabled('SEND_ENABLED'),
  rateLimiter,
  apiKeyGuard,
  upload.array('files', MAX_ATTACHMENT_COUNT),
  async (req, res) => {
  try {
    const to: string | undefined = req.body.to;
    const subject: string | undefined = req.body.subject;
    const html: string | undefined = req.body.html;
    const text: string | undefined = req.body.text;
    const cc = toArray(req.body.cc);
    const bcc = toArray(req.body.bcc);

    // --- validation ---
    if (!to || !isEmail(to)) {
      return fail(res, 400, '`to` must be a valid email address');
    }
    if (!subject || !subject.trim()) {
      return fail(res, 400, '`subject` is required');
    }
    for (const addr of [...(cc || []), ...(bcc || [])]) {
      if (!isEmail(addr)) {
        return fail(res, 400, `Invalid email in cc/bcc: ${addr}`);
      }
    }

    // --- attachments ---
    const files = (req.files as Express.Multer.File[] | undefined) || [];
    const attachments: Attachment[] = [];
    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return fail(
          res,
          400,
          `File extension (${ext || 'none'}) not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
        );
      }
      attachments.push({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype,
      });
    }

    const messageId = await sendMail({ to, cc, bcc, subject, html, text, attachments });
    return ok(res, { messageId });
  } catch (err: any) {
    return fail(res, 500, err?.message || 'Failed to send email');
  }
});
