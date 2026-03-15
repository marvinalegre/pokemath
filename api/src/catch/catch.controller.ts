import { Controller, Get, Req } from '@nestjs/common';
import { CatchService } from './catch.service';
import type { Request } from 'express';

@Controller('catch')
export class CatchController {
  constructor(private readonly catchService: CatchService) {}

  @Get()
  getQuestion(@Req() req: Request) {
    return this.catchService.getQuestion(req.user!.sub);
  }
}
