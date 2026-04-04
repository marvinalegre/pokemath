-- Migration number: 0001 	 2026-03-24T12:21:20.786Z
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT (strftime ('%Y-%m-%dT%H:%M:%SZ', 'now')),
  role TEXT DEFAULT 'guest' NOT NULL
);
