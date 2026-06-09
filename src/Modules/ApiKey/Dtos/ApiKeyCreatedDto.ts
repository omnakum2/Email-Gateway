import { ApiProperty } from '@nestjs/swagger';

// DTO returned only once when API key is created.
export class ApiKeyCreatedDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'mail_live_abcdef1234567890' })
  apiKey: string;

  @ApiProperty({ example: 'mail_live_abcd****' })
  keyPrefix: string;

  @ApiProperty({ description: 'Store this key securely. It will not be shown again.' })
  message: string;
}
