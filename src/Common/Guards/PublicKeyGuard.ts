import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ApiKeyService } from '../../Modules/ApiKey/ApiKeyService';
import { ApiKeyType } from '../Enums/ApiKeyType';

// Guard that validates Public API key from X-Public-Key header and attaches consumer to request.
// Also strictly validates the Origin.
@Injectable()
export class PublicKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("PublicKeyGuard");
    const request = context.switchToHttp().getRequest();
    const publicKey = request.headers['x-public-key'] || request.body?.publicKey;
    const origin = request.headers['origin'];
    console.log(publicKey, origin);

    if (!publicKey) {
      throw new UnauthorizedException('Missing X-Public-Key header');
    }

    // Validate the API key and get the consumer.
    const consumer = await this.apiKeyService.validateKey(publicKey, ApiKeyType.Public);
    if (!consumer) {
      throw new UnauthorizedException('Invalid Public API key');
    }

    // Validate allowed origin
    if (!origin) {
      throw new ForbiddenException('Missing Origin header for public request');
    }

    console.log(consumer.allowedOrigins);
    if (!consumer.allowedOrigins || consumer.allowedOrigins.length === 0) {
      throw new ForbiddenException('No allowed origins configured for this consumer');
    }

    if (!consumer.allowedOrigins.includes(origin)) {
      throw new ForbiddenException(`Origin ${origin} is not allowed for this consumer`);
    }

    // Attach consumer to request for downstream use.
    request.user = consumer;
    return true;
  }
}
