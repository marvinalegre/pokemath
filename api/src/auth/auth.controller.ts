import { Controller, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('guest')
  createGuest() {
    return this.authService.createGuest();
  }

  @Get('me')
  getMe(@Headers('authorization') authHeader: string) {
    return this.authService.getMe(authHeader);
  }
}
