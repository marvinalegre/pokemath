import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { users } from 'src/database/schema';

@Injectable()
export class PlayersService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.db.select().from(users);
  }
}
