import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { CatchService } from './catch.service';
import type { Request } from 'express';

class SubmitAnswerDto {
  answer: string;
}

@Controller('catch')
export class CatchController {
  constructor(private readonly catchService: CatchService) {}

  @Get()
  getQuestion(@Req() req: Request) {
    return this.catchService.getQuestion(req.user!.sub);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  submitAnswer(@Req() req: Request, @Body() body: SubmitAnswerDto) {
    return this.catchService.submitAnswer(req.user!.sub, body.answer);
  }
}
