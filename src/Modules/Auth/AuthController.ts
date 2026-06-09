import { Body, Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthLoginReponseDto, AuthLoginRequestDto } from './Dtos/AuthLoginRouteDto';
import { AuthUpdatePasswordDTO } from './Dtos/AuthUpdatePasswordDto';
import { AuthService } from './AuthService';
import { AuthGuard } from './AuthGuard';
import type { IUserRequest } from './AuthGuard';

@ApiTags('Users')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @ApiResponse({ status: 201, type: AuthLoginReponseDto })
  logIn(@Body() userData: AuthLoginRequestDto) {
    return this.authService.logIn(userData.email, userData.password);
  }

  @Post('update-password/:userId')
  @UseGuards(AuthGuard) 
  @ApiBearerAuth()
  @ApiResponse({ status: 201 })
  updatePassword(
    @Request() req: IUserRequest,
    @Param('userId') userId: string,
    @Body() body: AuthUpdatePasswordDTO,
  ) {
    return this.authService.updatePassword(
      req.user.id,
      userId,
      body,
    );
  }
}
