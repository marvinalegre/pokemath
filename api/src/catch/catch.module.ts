import { Module } from '@nestjs/common';
import { CatchController } from './catch.controller';
import { CatchService } from './catch.service';
import { PlayersModule } from 'src/players/players.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [PlayersModule, DatabaseModule],
  controllers: [CatchController],
  providers: [CatchService],
})
export class CatchModule {}
