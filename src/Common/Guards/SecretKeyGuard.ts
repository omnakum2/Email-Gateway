import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeyService } from '../../Modules/ApiKey/ApiKeyService';
import { ApiKeyType } from '../Enums/ApiKeyType';

// Guard that validates API key from Authorization header and attaches consumer to request.
@Injectable()
export class SecretKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    // Extract bearer token.
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization format. Use: Bearer <api_key>');
    }

    // Validate the API key and get the consumer.
    const consumer = await this.apiKeyService.validateKey(token, ApiKeyType.Secret);
    if (!consumer) {
      throw new UnauthorizedException('Invalid or revoked API key');
    }

    // Attach consumer to request for downstream use.
    request.user = consumer;
    return true;
  }
}
