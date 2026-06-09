import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../User/UserEntity';
import { AuthLoginReponseDto } from './Dtos/AuthLoginRouteDto';
import { UserService } from '../User/UserService';
import { Status } from '../../Common/Enums/Status';
import { UserMapper } from '../User/UserMapper';
import { AuthUpdatePasswordDTO } from './Dtos/AuthUpdatePasswordDto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private userMapper: UserMapper,
  ) { }

  private mapToGetLoginDto(params: {
    user: UserEntity;
    accessToken: string;
  }): AuthLoginReponseDto {
    const loginDto = new AuthLoginReponseDto();
    loginDto.accessToken = params.accessToken;
    if (params.user) {
      loginDto.user = this.userMapper.mapToGet(params.user);
    }
    return loginDto;
  }

  private generateUserAccessToken(user: UserEntity) {
    const payload = {
      sub: user.id,
      name: user.fullName,
      email: user.email,
    };
    return this.jwtService.signAsync(payload, {
      expiresIn: '24h'
    });
  }

  async logIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    const userEmploymentStatus = user?.status

    if (userEmploymentStatus === Status.Inactive) {
      throw new BadRequestException('User with the provided email has been terminated.')
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateUserAccessToken(user);
    return this.mapToGetLoginDto({ accessToken, user });
  }

  async updatePassword(
    requestingUserId: string,
    targetUserId: string,
    dto: AuthUpdatePasswordDTO
  ) {
    if (requestingUserId === targetUserId) {
      // Self-service: verify current password
      if (!dto.currentPassword) {
        throw new BadRequestException('Current password is required');
      }

      const user = await this.userService.findOneWithPasswordHash(targetUserId);
      const isMatch = await bcrypt.compare(dto.currentPassword, user.password);

      if (!isMatch) {
        throw new UnauthorizedException('Current password is incorrect');
      }
    }

    // Hash and update (validation done on frontend)
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.userService.updatePasswordHash(targetUserId, hashedPassword);

    return {
      message: 'Password changed successfully'
    };
  }
}
