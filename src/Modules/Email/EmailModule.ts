import { Module } from '@nestjs/common';
import { EmailService } from './EmailService';
import { EmailController } from './EmailController';
import { PublicEmailController } from './PublicEmailController';
import { ApiKeyModule } from '../ApiKey/ApiKeyModule';

@Module({
  imports: [ApiKeyModule],
  controllers: [EmailController, PublicEmailController],
  providers: [EmailService],
})
export class EmailModule {}
