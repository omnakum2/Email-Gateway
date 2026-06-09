import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFiles, Request } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { EmailService } from './EmailService';
import { SendEmailDto } from './Dtos/SendEmailDto';
import { SendAttachmentEmailDto } from './Dtos/SendAttachmentEmailDto';
import { PublicKeyGuard } from '../../Common/Guards/PublicKeyGuard';
import { MAX_ATTACHMENT_COUNT } from '../../Common/Constants/FileUpload';
import type { IUserRequest } from '../Auth/AuthGuard';

@ApiTags('Public Emails (Frontend)')
@Controller('public-emails')
@UseGuards(PublicKeyGuard)
@ApiHeader({
  name: 'X-Public-Key',
  description: 'Public API Key for Frontend integrations',
  example: 'pk_test_1234567890',
  required: true,
})
@ApiHeader({
  name: 'Origin',
  description: 'Browser Origin for CORS/Allowed Origins validation',
  example: 'https://example.com',
  required: true,
})
export class PublicEmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('send')
  @ApiOperation({ description: 'Send an email from frontend explicitly via Public Key and Origin verification' })
  @ApiResponse({ status: 201, description: 'Email dispatched' })
  send(
    @Body() dto: SendEmailDto,
    @Request() req: IUserRequest,
  ) {
    return this.emailService.send(dto, req.user);
  }

  @Post('send-attachment')
  @ApiOperation({ description: 'Send an email with attachments from frontend' })
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
