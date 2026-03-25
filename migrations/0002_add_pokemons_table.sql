-- Migration number: 0002 	 2026-03-25T02:04:41.523Z
CREATE TABLE pokemons (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  color TEXT NOT NULL,
  availability TEXT NOT NULL
);
