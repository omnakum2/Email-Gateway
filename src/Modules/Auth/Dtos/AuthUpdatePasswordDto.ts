import { ApiProperty } from '@nestjs/swagger';

export class AuthUpdatePasswordDTO {
  @ApiProperty()
  newPassword: string;

  @ApiProperty()
  currentPassword: string;
}

