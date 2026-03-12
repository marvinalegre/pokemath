import { Module } from '@nestjs/common';
import { CatchController } from './catch.controller';
import { CatchService } from './catch.service';

@Module({
  controllers: [CatchController],
  providers: [CatchService]
})
export class CatchModule {}
