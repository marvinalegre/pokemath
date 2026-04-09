-- Migration number: 0004 	 2026-04-09T15:28:55.956Z
DROP TABLE IF EXISTS captured_pokemons;

CREATE TABLE captured_pokemons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  pokemon_id INTEGER NOT NULL REFERENCES pokemons (id),
  caught_at_rating REAL NOT NULL, -- The player's ELO when they caught it
  captured_at TEXT NOT NULL DEFAULT (strftime ('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
