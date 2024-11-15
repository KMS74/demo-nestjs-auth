import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from '../auth.type';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // if no token, throw unauthorized exception
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // verify token and attach payload to request object
      const payload: JwtPayload = this.jwtService.verify(token);
      // if token is valid, attach user object to request object
      request.user = {
        userId: payload.sub,
        username: payload.username,
      };
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
