PRAGMA defer_foreign_keys=TRUE;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    jwt_sub TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

DROP TABLE IF EXISTS pokemons;
CREATE TABLE pokemons (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL,
    availability TEXT NOT NULL
);

DROP TABLE IF EXISTS types;
CREATE TABLE types (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

DROP TABLE IF EXISTS user_questions;
CREATE TABLE user_questions (
    user_id INTEGER NOT NULL UNIQUE,
    question_code TEXT NOT NULL,
    question_parameters TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

DROP TABLE IF EXISTS user_pokemons;
CREATE TABLE user_pokemons (
    id INTEGER PRIMARY KEY,
    user_pokemon_ext_id TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    pokemon_id INTEGER NOT NULL,
    caught_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    pinned INTEGER DEFAULT 0 NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemons(id)
);

DROP TABLE IF EXISTS pokemon_types;
CREATE TABLE pokemon_types (
    pokemon_id INTEGER NOT NULL,
    type_id INTEGER NOT NULL,
    FOREIGN KEY (pokemon_id) REFERENCES pokemons(id),
    FOREIGN KEY (type_id) REFERENCES types(id)
);
