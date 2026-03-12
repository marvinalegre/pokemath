import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const catchQuestions = sqliteTable('catch_questions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().unique(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
});
