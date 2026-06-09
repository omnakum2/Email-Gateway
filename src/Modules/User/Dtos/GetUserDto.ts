import { ApiProperty } from '@nestjs/swagger';
import { ApiKeyCreatedDto } from '../../ApiKey/Dtos/ApiKeyCreatedDto';
import { UserType } from '../../../Common/Enums/UserType';
import { Status } from '../../../Common/Enums/Status';

// DTO for consumer API responses.
export class GetUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  userType: UserType;

  @ApiProperty()
  status: Status;

  @ApiProperty({ nullable: true })
  defaultFromName: string;

  @ApiProperty({ nullable: true })
  defaultReplyToEmail: string;

  @ApiProperty({ nullable: true })
  footerText: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  apiKey: ApiKeyCreatedDto;
}
