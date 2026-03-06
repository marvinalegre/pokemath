import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env.validation';
import Database from 'better-sqlite3';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  db: BetterSQLite3Database<typeof schema>;

  constructor(private readonly configService: ConfigService<Env, true>) {}

  onModuleInit() {
    const sqlite = new Database(
      this.configService.get('DATABASE_URL', { infer: true }),
    );
    sqlite.pragma('journal_mode = WAL');

    this.db = drizzle(sqlite, { schema });
  }
}
