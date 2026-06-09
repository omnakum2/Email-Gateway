import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFiles, Request } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { EmailService } from './EmailService';
import { SendEmailDto } from './Dtos/SendEmailDto';
import { SendAttachmentEmailDto } from './Dtos/SendAttachmentEmailDto';
import { SecretKeyGuard } from '../../Common/Guards/SecretKeyGuard';
import { MAX_ATTACHMENT_COUNT } from '../../Common/Constants/FileUpload';
import type { IUserRequest } from '../Auth/AuthGuard';

@ApiTags('Emails')
@Controller('emails')
@UseGuards(SecretKeyGuard)
@ApiBearerAuth()
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('send')
  @ApiOperation({ description: 'Send an email' })
  @ApiResponse({ status: 201, description: 'Email dispatched' })
  send(
    @Body() dto: SendEmailDto,
    @Request() req: IUserRequest,
  ) {
    return this.emailService.send(dto, req.user);
  }

  @Post('send-attachment')
  @ApiOperation({ description: 'Send an email with attachments' })
  @ApiResponse({ status: 201, description: 'Email dispatched' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', MAX_ATTACHMENT_COUNT))
  sendWithAttachments(
    @Body() dto: SendAttachmentEmailDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: IUserRequest,
  ) {
    return this.emailService.sendWithAttachments(dto, files, req.user);
  }
}
