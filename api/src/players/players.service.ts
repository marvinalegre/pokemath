import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from 'src/database/database.service';
import { users } from 'src/database/schema';

@Injectable()
export class PlayersService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.db.select().from(users);
  }

  findBySub(jwtSub: string) {
    const user = this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.jwtSub, jwtSub))
      .get();
    if (!user) {
      return null;
    } else {
      return { id: user.id };
    }
  }
}
