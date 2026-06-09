import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthLoginReponseDto, AuthLoginRequestDto } from './Dtos/AuthLoginRouteDto';
import { AuthUpdatePasswordDTO } from './Dtos/AuthUpdatePasswordDto';
import { AuthService } from './AuthService';
import { AuthGuard } from './AuthGuard';
import type { IUserRequest } from './AuthGuard';
import * as net from 'net';

@ApiTags('Users')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @ApiResponse({ status: 201, type: AuthLoginReponseDto })
  logIn(@Body() userData: AuthLoginRequestDto) {
    return this.authService.logIn(userData.email, userData.password);
  }


  @Get('smtp-test')
  test() {
    return new Promise((resolve, reject) => {
      const socket = net.connect(587, 'smtp.gmail.com');

      socket.on('connect', () => {
        resolve('connected');
        socket.destroy();
      });

      socket.on('error', reject);

      socket.setTimeout(10000, () => {
        socket.destroy();
        reject(new Error('timeout'));
      });
    });
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
