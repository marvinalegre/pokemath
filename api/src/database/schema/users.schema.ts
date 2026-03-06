import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  jwtSub: text('jwt_sub').notNull().unique(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  role: text('role', { enum: ['guest', 'user', 'admin'] })
    .notNull()
    .default('guest'),
});
