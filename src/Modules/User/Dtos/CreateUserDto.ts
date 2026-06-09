import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../../Common/Enums/Status';
import { UserType } from '../../../Common/Enums/UserType';

// DTO for creating a new user.
export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: 'example@email.com' })
  email: string;

  @ApiProperty({ example: 'password' })
  password: string;

  @ApiProperty({ example: UserType.CONSUMER })
  userType: UserType;

  @ApiProperty({ example: Status.Active })
  status: Status;

  @ApiProperty({ example: 'Email Gateway', required: false })
  defaultFromName?: string;

  @ApiProperty({ example: 'support@email-gateway.com', required: false })
  defaultReplyToEmail?: string;

  @ApiProperty({ example: 'Powered by Email Gateway', required: false })
  footerText?: string;

  @ApiProperty({ example: ['https://myapp.com', 'http://localhost:3000'], required: false })
  allowedOrigins?: string[];
}
