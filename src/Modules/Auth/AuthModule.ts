import { Module } from '@nestjs/common';
import { AuthController } from './AuthController';
import { AuthService } from './AuthService';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../User/UserModule';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    UserModule
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
