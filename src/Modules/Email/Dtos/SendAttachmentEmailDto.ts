import { SendEmailDto } from './SendEmailDto';
import { ApiProperty } from '@nestjs/swagger';

// DTO for sending an email with file attachments.
export class SendAttachmentEmailDto extends SendEmailDto {
  @ApiProperty({ type: [String], format: 'binary' })
  files?: Express.Multer.File[];
}
