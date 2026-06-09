import { ApiProperty } from '@nestjs/swagger';
import { ApiKeyType } from '../../../Common/Enums/ApiKeyType';

// DTO for creating a new API key.
export class CreateApiKeyDto {
  @ApiProperty({ enum: ApiKeyType, example: ApiKeyType.Public })
  type: ApiKeyType;
}
