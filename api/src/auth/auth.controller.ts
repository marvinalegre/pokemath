import { Controller, Get } from '@nestjs/common';
import { StringGeneratorService } from 'src/common/utils/string-generator.service';

@Controller('auth')
export class AuthController {
  constructor(private stringGeneratorService: StringGeneratorService) {}

  @Get('guest')
  getGuest() {
    return {
      username: `User_${this.stringGeneratorService.generate(5)}`,
    };
  }
}
