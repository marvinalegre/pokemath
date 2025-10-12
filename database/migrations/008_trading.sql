DROP TABLE IF EXISTS trades;
CREATE TABLE trades (
    id INTEGER PRIMARY KEY,
    initiator_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    trade_ext_id TEXT NOT NULL,
    pokemon_id INTEGER NOT NULL,
    status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'completed')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

DROP TABLE IF EXISTS trade_items;
CREATE TABLE trade_items (
    id INTEGER PRIMARY KEY,
    trade_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    user_pokemon_id INTEGER NOT NULL,
    FOREIGN KEY (trade_id) REFERENCES trades(id) ON DELETE CASCADE
);
