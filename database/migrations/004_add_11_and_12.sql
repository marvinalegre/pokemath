INSERT INTO pokemons VALUES(11,'Metapod','This POKéMON is vulnerable to attack while its shell is soft, exposing its weak and tender body.','#cddbb9','CE', 12, 152);
INSERT INTO pokemons VALUES(12,'Butterfree','In battle, it flaps its wings at high speed to release highly toxic dust into the air.','#f9fafd','CEE', NULL, NULL);

UPDATE pokemons SET color = '#d0e9c9', evolution_id = 11, evolution_condition = 51 where id = 10;
UPDATE user_pokemons SET experience = 0 where pokemon_id = 10;
