import { Injectable, BadRequestException } from '@nestjs/common';
import { SendEmailDto } from './Dtos/SendEmailDto';
import { SendAttachmentEmailDto } from './Dtos/SendAttachmentEmailDto';
import { NodemailerProvider } from '../../Providers/Nodemailer/NodemailerProvider';
import { UserEntity } from '../User/UserEntity';
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE, MAX_ATTACHMENT_COUNT } from '../../Common/Constants/FileUpload';
import * as path from 'path';
import { EntityManager } from 'typeorm';

@Injectable()
export class EmailService {
  constructor(private readonly nodemailerProvider: NodemailerProvider, private readonly em: EntityManager) { }

  // Send an simple text or html email.
  async send(dto: SendEmailDto, consumer: UserEntity): Promise<{ message: string }> {
    await this.nodemailerProvider.sendMail({
      from: `${consumer.defaultFromName} <${process.env.EMAIL_USER}>`,
      to: dto.to,
      cc: dto.cc,
      bcc: dto.bcc,
      subject: dto.subject,
      html: dto.html,
      text: dto.text,
      replyTo: consumer?.defaultReplyToEmail,
    });

    return { message: 'Email sent successfully' };
  }

  // Send an email with file attachments.
  async sendWithAttachments(
    dto: SendAttachmentEmailDto,
    files: Express.Multer.File[],
    consumer: UserEntity,
  ): Promise<{ message: string }> {

    // Validate attachments.
    this.validateAttachments(files);

    // Build attachment objects.
    const attachments = files.map((file) => ({
      filename: file.originalname,
      content: file.buffer,
      contentType: file.mimetype,
    }));

    await this.nodemailerProvider.sendMail({
      from: `${consumer.defaultFromName} <${process.env.EMAIL_USER}>`,
      to: dto.to,
      cc: dto.cc,
      bcc: dto.bcc,
      subject: dto.subject,
      html: dto.html,
      text: dto.text,
      replyTo: consumer.defaultReplyToEmail,
      attachments,
    });

    return { message: 'Email with attachments sent successfully' };
  }

  // Validate file attachments.
  private validateAttachments(files: Express.Multer.File[]): void {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one attachment is required');
    }

    if (files.length > MAX_ATTACHMENT_COUNT) {
      throw new BadRequestException(`Maximum ${MAX_ATTACHMENT_COUNT} attachments allowed`);
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        throw new BadRequestException(`File (${file.originalname}) exceeds maximum size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }

      const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        throw new BadRequestException(`File extension (${ext}) is not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      }
    }
  }
}
