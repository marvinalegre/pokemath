import express from "express";
import { resolve } from "path";
import pkg from "pg";
const { Client } = pkg;
import "dotenv/config";

const app = express();
const port = 3000;
const db = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PW,
  port: process.env.PG_PORT,
};

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(resolve(process.cwd(), "view/index.html"));
});

app.get("/question", (req, res) => {
  res.sendFile(resolve(process.cwd(), "view/question.html"));
});

app.get("/pokemons", (req, res) => {
  res.sendFile(resolve(process.cwd(), "view/pokemons.html"));
});

app.get("/pokemon/:id", (req, res) => {
  res.sendFile(resolve(process.cwd(), "view/pokemon.html"));
});

app.get("/marvin", (req, res) => {
  res.sendFile(resolve(process.cwd(), "view/marvin.html"));
});

app.get("/api/marvin", async (req, res) => {
  const client = new Client(db);

  await client.connect();

  const { rows } = await client.query(
    `select * from user_pokemon inner join pokemons on pokemons.id = user_pokemon.pokemon_id where user_id = 2`
  );

  await client.end();

  res.json(rows);
});

app.get("/api/pokemons", async (req, res) => {
  const client = new Client(db);

  await client.connect();

  const { rows } = await client.query(
    `select * from user_pokemon inner join pokemons on pokemons.id = user_pokemon.pokemon_id where user_id = 1`
  );

  await client.end();

  res.json(rows);
});

// app.get("/api/release/:id", async (req, res) => {
//   const client = new Client({
//     user: "marvinalegre",
//     host: "localhost",
//     database: "pokemons",
//     password: "foobar",
//     port: 5432,
//   });

//   await client.connect();

//   const { rows } = await client.query(
//     `select * from user_pokemon where pokemon_id = ${req.params.id} and user_id = 1`
//   );

// });

app.get("/api/claimpokemon", async (req, res) => {
  const client = new Client(db);

  const dartboard = [
    80, 100, 105, 185, 205, 210, 290, 310, 315, 2315, 4315, 4715, 6715, 8715,
    9115, 11115, 13115, 13515, 15515, 17515, 19515, 21515, 23515, 25515, 27515,
    29515, 29605, 29695, 31695, 33695, 34095, 36095, 38095, 38495, 40495, 40895,
    40985, 41075, 43075, 45075, 47075, 49075, 51075, 53075, 53475, 55475, 57475,
    59475, 61475, 63475, 65475, 65565, 65655, 67655, 69655, 71655, 72055, 74055,
    74455, 76455, 78455, 78855, 80855, 82855, 82862, 84862, 86862, 86869, 86959,
    87049, 87139, 89139, 89539, 91539, 93539, 93546, 95546, 95946, 97946, 99946,
    101946, 103946, 104026, 106026, 108026, 110026, 112026, 114026, 116026,
    118026, 118426, 120426, 122426, 122433, 124433, 126433, 128433, 130433,
    132433, 134433, 136433, 138433, 138833, 140833, 142833, 142913, 142993,
    143073, 145073, 147073, 149073, 151073, 153073, 155073, 157073, 159073,
    161073, 163073, 165073, 167073, 167473, 167553, 169553, 169633, 171633,
    171723, 171813, 173813, 175813, 175833, 175913, 177913, 177993, 178013,
    178033, 178053, 178133, 178213, 178233, 178313, 178333, 178413, 178433,
    178434, 178435, 178436, 178516, 178536, 178541, 178542, 178543,
  ];

  const subset = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 23, 24, 25, 26, 27, 28, 35, 36, 37, 38, 39, 40,
    43, 44, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 69,
    70, 71, 72, 73, 74, 75, 76, 79, 80, 81, 82, 84, 85, 86, 87, 88, 89, 90, 91,
    92, 93, 94, 96, 97, 100, 101, 102, 103, 106, 107, 109, 110, 111, 112, 113,
    116, 117, 123, 125, 126, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137,
    143, 144, 145, 146, 147, 148, 149, 150, 151,
  ];

  function hitDartboard(n) {
    if (n < dartboard[0]) {
      return 1;
    } else {
      for (let i = 1; i < dartboard.length; i++) {
        if (dartboard[i - 1] < n && n <= dartboard[i]) {
          return i + 1;
        }
      }
    }

    // let lb = 0;
    // let hb = dartboard.length - 1;

    // while (lb !== hb) {
    //   console.log(lb, hb); ///////////////////////
    //   const i = Math.floor((hb - lb) / 2 + lb);
    //   if (dartboard[i - 1] < n && n <= dartboard[i]) {
    //     return i + 1;
    //   } else if (n <= dartboard[i - 1]) {
    //     hb = i - 1;
    //   } else if (dartboard[i] < n) {
    //     lb = i;
    //   }

    //   if (lb === dartboard.length - 2) {
    //     return dartboard.length;
    //   }
    // }

    // if (lb === hb) {
    //   return 1;
    // }
  }

  const result = hitDartboard(
    Math.floor(Math.random() * dartboard[dartboard.length - 1] + 1)
  );
  if (subset.includes(result)) {
    await client.connect();

    await client.query(
      `insert into user_pokemon (user_id, pokemon_id) values (1, ${result})`
    );

    await client.end();
    res.json({
      caught: true,
      id: result,
    });
  } else {
    res.json({
      caught: false,
    });
  }
});

app.get("/pokemoncount", async (req, res) => {
  const client = new Client(db);

  await client.connect();

  const { rows } = await client.query(
    `select count(*) from user_pokemon where user_id = 1`
  );

  const { rows: bar } = await client.query(
    `select count(*) from user_pokemon where user_id = 2`
  );

  await client.end();

  res.json({
    count: rows[0].count,
    marvinsCount: bar[0].count,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
