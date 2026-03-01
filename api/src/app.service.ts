import { Injectable } from '@nestjs/common';
import { StringGeneratorService } from './common/utils/string-generator.service';

@Injectable()
export class AppService {
  constructor(private readonly stringGen: StringGeneratorService) {}

  getHello(): { message: string } {
    return { message: `Hello you! (${this.stringGen.generate()})` };
  }
}
