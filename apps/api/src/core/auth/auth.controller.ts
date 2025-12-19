import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Me } from './me.decorator'
import { JwtGuard } from './guards/jwt.guard'

@Controller('core/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { email: string; otp: string }) {
    return this.authService.login(body);
  }

  @Post('otp')
  getOTP(@Body() body: { email: string }) {
    return this.authService.getOTP(body?.email || '');
  }

  @Post('register')
  register(@Body() body: { email: string; name: string }) {
    return this.authService.register(body);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getProfile(@Me() user: any) {
    return this.authService.getMe(user);
  }
}
