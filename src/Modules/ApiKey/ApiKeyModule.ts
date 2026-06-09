import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyEntity } from './ApiKeyEntity';
import { ApiKeyService } from './ApiKeyService';
import { ApiKeyController } from './ApiKeyController';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKeyEntity])],
  controllers: [ApiKeyController],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeyModule { }
