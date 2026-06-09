import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from '../../User/Dtos/GetUserDto';

export class AuthLoginReponseDto {
  @ApiProperty()
  user: GetUserDto;

  @ApiProperty()
  accessToken: string;
}

export class AuthLoginRequestDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
