import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { email: string; otp: string }, @Headers('x-project-id') projectId: string) {
    return this.authService.login(body, projectId);
  }

  @Post('otp')
  getOTP(@Body() body: { email: string }) {
    return this.authService.getOTP(body?.email || '');
  }

  @Post('register')
  register(@Body() body: { email: string; name: string }) {
    return this.authService.register(body);
  }
}
