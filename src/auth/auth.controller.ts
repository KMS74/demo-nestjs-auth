import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthInput } from './auth.type';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() input: AuthInput) {
    return this.authService.authenticate(input);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getUserInfo(@Req() request) {
    return request?.user;
  }
}
