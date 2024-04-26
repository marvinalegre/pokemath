import subset from "./pokemons.js";
import pkg from "pg";
const { Client } = pkg;

const pokemathDb = new Client({
  user: "marvinalegre",
  host: "localhost",
  database: "pokemath",
  password: "foobar",
  port: 5432,
});

const pokemonDb = new Client({
  user: "marvinalegre",
  host: "localhost",
  database: "pokemons",
  password: "foobar",
  port: 5432,
});

// const response = await fetch(
//   "https://pokeapi.deno.dev/pokemon?offset=1&limit=151"
// );
// const pokemons = await response.json();

await pokemonDb.connect();
const { rows: pokemons } = await pokemonDb.query("select * from pokemons");
await pokemonDb.end();

await pokemathDb.connect();

for (const pokemonId of subset) {
  for (const pokemon of pokemons) {
    if (pokemonId == pokemon.id) {
      await pokemathDb.query(
        `insert into pokemons (id, name, description, imageUrl, color, availability, sprite) values (${
          pokemon.id
        }, '${escapeApostrophes(pokemon.name)}', '${escapeApostrophes(
          pokemon.description
        )}', 'https://pokemons.pages.dev/sugimori/${pokemonId}.png', '${
          pokemon.color
        }', '${
          pokemon.availability
        }', 'https://pokemons.pages.dev/sprites/pm${padNumber(
          pokemonId
        )}_00_00_00_big.png')`
      );
    }
  }
}

await pokemathDb.end();

function escapeApostrophes(str) {
  return str.replace(/'/g, "''");
}

function padNumber(num) {
  let numString = num.toString();
  let zerosToPad = 4 - numString.length;
  if (zerosToPad <= 0) {
    return numString;
  }
  let paddedString = "0".repeat(zerosToPad) + numString;
  return paddedString;
}
