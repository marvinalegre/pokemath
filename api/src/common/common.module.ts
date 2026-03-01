import { Global, Module } from '@nestjs/common';
import { StringGeneratorService } from './utils/string-generator.service';

@Global()
@Module({
  providers: [StringGeneratorService],
  exports: [StringGeneratorService],
})
export class CommonModule {}
