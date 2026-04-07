-- Migration number: 0003 	 2026-04-04T04:14:16.702Z
-- One row per question "type". 
-- A type is a generator + its parameters + its renderer.
DROP TABLE IF EXISTS question_types;

CREATE TABLE question_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL, -- e.g. 'arithmetic'
  generator TEXT NOT NULL, -- handler key in app code, e.g. 'addition'
  generator_params TEXT NOT NULL DEFAULT '{}', -- JSON: {"min_a":0,"max_a":10,...}
  renderer TEXT NOT NULL, -- frontend component key, e.g. 'math_expression'
  renderer_options TEXT NOT NULL DEFAULT '{}', -- JSON: {"layout":"horizontal"}
  rating REAL NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime ('%Y-%m-%dT%H:%M:%SZ', 'now')),
  UNIQUE (generator, generator_params) -- enforce canonical key ordering in application layer before insert
);

-- The materialized question instance served to a user.
-- One row per user at a time (enforced by UNIQUE on user_id).
-- Cleared when the user answers correctly or skips.
DROP TABLE IF EXISTS active_questions;

CREATE TABLE active_questions (
  user_id INTEGER NOT NULL UNIQUE REFERENCES users (id),
  question_type_id INTEGER NOT NULL REFERENCES question_types (id),
  question_text TEXT NOT NULL, -- generated display text, e.g. '3 + 7 = ?'
  answer TEXT NOT NULL, -- expected answer, e.g. '10'
  assigned_at TEXT NOT NULL DEFAULT (strftime ('%Y-%m-%dT%H:%M:%SZ', 'now')),
  retry_after TEXT
);

-- Every answer attempt, win or lose, is logged here.
DROP TABLE IF EXISTS answer_logs;

CREATE TABLE answer_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users (id),
  question_type_id INTEGER NOT NULL REFERENCES question_types (id),
  question_text TEXT NOT NULL, -- snapshot of what was shown
  user_answer TEXT NOT NULL, -- raw answer the user submitted
  correct_answer TEXT NOT NULL, -- snapshot of expected answer
  is_correct INTEGER NOT NULL CHECK (is_correct IN (0, 1)),
  answered_at TEXT NOT NULL DEFAULT (strftime ('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
