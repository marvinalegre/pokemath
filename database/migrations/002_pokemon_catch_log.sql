DROP TABLE IF EXISTS pokemon_catch_log;
CREATE TABLE pokemon_catch_log (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    pokemon_id INTEGER NOT NULL,
    user_pokemon_ext_id TEXT NOT NULL UNIQUE,
    caught_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
