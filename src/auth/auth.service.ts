import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthInput, AuthResult, JwtPayload, SignInData } from './auth.type';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    return this.signIn(user);
  }

  private async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService.findOne(input.username);
    if (user && user.password === input.password) {
      return {
        userId: user.userId,
        username: user.username,
      };
    }
    return null;
  }

  private async signIn(user: SignInData): Promise<AuthResult> {
    const payload: JwtPayload = {
      sub: user.userId,
      username: user.username,
    };
    const accessToken = await this.jwtService.sign(payload);

    return {
      accessToken,
      userId: user.userId,
      username: user.username,
    };
  }
}
