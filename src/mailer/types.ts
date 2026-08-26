// A single file attachment to send with an email.
export interface Attachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

// Everything needed to send one email.
export interface SendMailInput {
  to: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: Attachment[];
}
