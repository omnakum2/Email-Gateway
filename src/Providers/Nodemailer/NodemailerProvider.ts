import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailProvider, SendMailOptions, SendMailResult, MailAttachment } from '../../Common/Interfaces/MailProvider';

// Nodemailer-based mail provider.
@Injectable()
export class NodemailerProvider implements MailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Send an email using Nodemailer.
  async sendMail(options: SendMailOptions): Promise<SendMailResult> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    if (options.cc && options.cc.length > 0) {
      mailOptions.cc = options.cc;
    }

    if (options.bcc && options.bcc.length > 0) {
      mailOptions.bcc = options.bcc;
    }

    if (options.replyTo) {
      mailOptions.replyTo = options.replyTo;
    }

    if (options.attachments && options.attachments.length > 0) {
      mailOptions.attachments = options.attachments.map((att: MailAttachment) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType,
      }));
    }

    const info = await this.transporter.sendMail(mailOptions);
    return { messageId: info.messageId };
  }
}
