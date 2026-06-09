import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { parseArrayField } from '../utils/ArrayParser';

export class SendEmailDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  to: string;

  @ApiProperty({
    example: ['cc@example.com'],
    required: false,
    type: [String],
  })
  @Transform(({ value }) => parseArrayField(value))
  @IsEmail({}, { each: true })
  cc?: string[];

  @ApiProperty({
    example: ['bcc@example.com'],
    required: false,
    type: [String],
  })
  @Transform(({ value }) => parseArrayField(value))
  @IsEmail({}, { each: true })
  bcc?: string[];

  @ApiProperty({
    example: 'An email API service',
  })
  subject: string;

  @ApiProperty({
    example: '<h1>Email Gateway</h1>',
    required: false,
  })
  html?: string;

  @ApiProperty({
    example: 'Welcome to our platform',
    required: false,
  })
  text?: string;
}