import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from '../auth.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization; // Bearer <TOKEN>
    const token = authorization?.split(' ')[1];

    // if no token, throw unauthorized exception
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // verify token and attach payload to request object
      const payload: JwtPayload = this.jwtService.verify(token);
      request.user = {
        userId: payload.sub,
        username: payload.username,
      };
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
