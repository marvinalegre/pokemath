import { Controller, Get } from '@nestjs/common';
import { PlayersService } from './players.service';
import { Public } from 'src/auth/auth.guard';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Public()
  @Get()
  findAll() {
    return this.playersService.findAll();
  }
}
