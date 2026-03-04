import { Injectable, OnModuleInit } from '@nestjs/common';
import Database from 'better-sqlite3';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: any;

  onModuleInit() {
    this.db = new Database('/var/lib/pokemath/pokemath.db');

    this.db.pragma('journal_mode = WAL');

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        jwt_sub TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        role TEXT NOT NULL DEFAULT 'guest'
          CHECK (role IN ('guest', 'user', 'admin'))
      );
    `);
  }

  run(sql: string, params: any[] = []) {
    const stmt = this.db.prepare(sql);
    const result = stmt.run(params);
    return { id: result.lastInsertRowid };
  }

  query(sql: string, params: any[] = []) {
    const stmt = this.db.prepare(sql);
    return stmt.all(params);
  }
}
