import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './AppModule';
import { UserService } from './Modules/User/UserService';
import { createSuperAdmin } from './Modules/User/superAdminSeed';
import * as dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  // Swagger Documentation configuration
  const config = new DocumentBuilder()
    .setTitle('Email Gateway API')
    .setVersion('1.0')
    .addServer(process.env.SERVER_URL || 'http://localhost:3000')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, { useGlobalPrefix: true });

  const userService = app.get(UserService);
  await createSuperAdmin(userService);

  // Start the server
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
