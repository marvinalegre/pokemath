import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.guard';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get('guest')
  createGuest() {
    return this.authService.createGuest();
  }

  @Get('me')
  getMe(@Req() req: Request) {
    return this.authService.getMe(req.user!.sub);
  }
}
