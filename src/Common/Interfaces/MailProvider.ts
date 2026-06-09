// Mail provider interface for sending emails.
export interface MailProvider {
  sendMail(options: SendMailOptions): Promise<SendMailResult>;
}

export interface SendMailOptions {
  from: string;
  to: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}

export interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

export interface SendMailResult {
  messageId: string;
}
