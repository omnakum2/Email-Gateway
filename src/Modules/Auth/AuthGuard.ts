import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../User/UserEntity';
import { EntityManager } from 'typeorm';

export interface IUserRequest extends Request {
  user: UserEntity;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private em: EntityManager) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = await this.jwtService.verifyAsync(token); // Verify the token
      const user = await this.em.getRepository(UserEntity).findOne({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException('User not found.');
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
