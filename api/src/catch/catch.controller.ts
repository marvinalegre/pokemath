import { Controller, Get } from '@nestjs/common';
import { CatchService } from './catch.service';

@Controller('catch')
export class CatchController {
  constructor(private readonly catchService: CatchService) {}

  @Get()
  getQuestion() {
    const { question, answer } = this.catchService.getQuestion();
    return { question };
  }
}
