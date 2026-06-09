import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database.config';
import { ScheduleModule } from '@nestjs/schedule';
import { NodemailerModule } from './Providers/Nodemailer/NodemailerModule';
import { UserModule } from './Modules/User/UserModule';
import { ApiKeyModule } from './Modules/ApiKey/ApiKeyModule';
import { EmailModule } from './Modules/Email/EmailModule';
import { AuthModule } from './Modules/Auth/AuthModule';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...AppDataSource.options,
      }),
    }),
    ScheduleModule.forRoot(),
    NodemailerModule,
    UserModule,
    ApiKeyModule,
    EmailModule,
    AuthModule,
  ],
})
export class AppModule { }
