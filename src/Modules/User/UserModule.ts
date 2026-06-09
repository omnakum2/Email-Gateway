import { Module } from '@nestjs/common';
import { UserService } from './UserService';
import { UserController } from './UserController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './UserEntity';
import { UserMapper } from './UserMapper';
import { ApiKeyModule } from '../ApiKey/ApiKeyModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ApiKeyModule
  ],
  controllers: [UserController],
  providers: [UserService, UserMapper],
  exports: [UserService, UserMapper],
})
export class UserModule { }
