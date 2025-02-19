import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() user: Record<string, any>) {
    return this.authService.signIn(user.email, user.password);
  }

  @Post('refresh')
  async refreshToken(@Body() body: { refresh_token: string }) {
    const { refresh_token } = body;
    try {
      return await this.authService.refreshAccessToken(refresh_token);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
