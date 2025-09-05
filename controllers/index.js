import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
);
import db from "../database/db.js";
import { bot, chatId } from "../telegram-bot.js";

const home = (req, res) => {
  if (!req.sub) {
    return res.render("home", { username: undefined });
  }

  const { username } = getUser(req.sub);

  return res.render("home", { username });
};

const catchForm = (req, res) => {
  const { username, id } = req.user;

  const questions = db
    .prepare(
      "select question_code, question_parameters from user_questions where user_id = ?",
    )
    .bind(id)
    .all();

  if (questions.length === 1) {
    return res.render(`questions/${questions[0].question_code}`, {
      username,
      generalError: undefined,
      qParameters: JSON.parse(questions[0].question_parameters),
    });
  }

  const qCode = getCode();
  const { qParameters, qAnswer } = getParametersAndAnswer(qCode);

  res.render(`questions/${qCode}`, {
    username,
    generalError: undefined,
    qParameters,
  });

  db.prepare(
    "insert into user_questions (user_id, question_code, question_parameters, answer) values (?, ?, ?, ?)",
  )
    .bind(id, qCode, JSON.stringify(qParameters), String(qAnswer))
    .run();
};

const catchHandler = async (req, res) => {
  const { answer } = req.body;
  const { username, id } = req.user;

  const questions = db
    .prepare(
      "select answer, question_parameters, question_code from user_questions where user_id = ?",
    )
    .bind(id)
    .all();

  // record submitted answers
  db.prepare(
    "insert into question_log (user_id, answer, correct_answer, question_code, question_parameters) values (?, ?, ?, ?, ?)",
  )
    .bind(
      id,
      answer,
      questions[0].answer,
      questions[0].question_code,
      questions[0].question_parameters,
    )
    .run();

  if (questions[0].answer !== answer) {
    return res.render(`questions/${questions[0].question_code}`, {
      username,
      generalError: "Wrong answer.",
      qParameters: JSON.parse(questions[0].question_parameters),
    });
  }

  db.prepare("delete from user_questions where user_id = ?").bind(id).run();

  const die = rollDie();
  if (die === "got away") {
    const qCode = getCode();
    const { qParameters, qAnswer } = getParametersAndAnswer(qCode);

    db.prepare(
      "insert into user_questions (user_id, question_code, question_parameters, answer) values (?, ?, ?, ?)",
    )
      .bind(id, qCode, JSON.stringify(qParameters), String(qAnswer))
      .run();

    return res.render(`questions/${qCode}`, {
      username,
      generalError: "The pokemon got away.",
      qParameters,
    });
  }

  const pokemons = db
    .prepare("select id from pokemons where availability = ?")
    .bind(die)
    .all();

  const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
  const extId = nanoid();

  let experience = null;
  if (
    db
      .prepare("select evolution_id from pokemons where id = ?")
      .bind(randomPokemon.id)
      .all()[0].evolution_id
  ) {
    experience = 0;
  }

  db.prepare(
    "insert into user_pokemons (user_pokemon_ext_id, user_id, pokemon_id, experience) values (?, ?, ?, ?)",
  )
    .bind(extId, id, randomPokemon.id, experience)
    .run();

  db.prepare(
    "insert into pokemon_catch_log (user_id, pokemon_id, user_pokemon_ext_id) values (?, ?, ?)",
  )
    .bind(id, randomPokemon.id, extId)
    .run();

  res.redirect("/catch/latest");
  await bot.telegram.sendMessage(chatId, `${username} just caught a pokemon!`);
};

const players = (req, res) => {
  const players = db
    .prepare("select username from users order by username asc")
    .all();

  if (!req.sub) {
    return res.render("players", {
      username: undefined,
      players,
    });
  }

  const { username } = getUser(req.sub);

  return res.render("players", { players, username });
};

const player = (req, res) => {
  const users = db
    .prepare("select id from users where username = ?")
    .bind(req.params.username.toLowerCase())
    .all();

  if (!users.length) {
    return res.status(404).render("404");
  }

  const pokemons = db
    .prepare(
      "select pokemon_id as id, user_pokemon_ext_id as ext_id from user_pokemons where user_id = ? order by caught_at desc",
    )
    .bind(users[0].id)
    .all();

  if (!req.sub) {
    return res.render("player", {
      username: undefined,
      requestedPlayer: req.params.username,
      pokemons,
    });
  }

  const { username } = getUser(req.sub);

  return res.render("player", {
    username,
    requestedPlayer: req.params.username,
    pokemons,
  });
};

const pokemon = (req, res) => {
  const users = db
    .prepare("select id from users where username = ?")
    .bind(req.params.username)
    .all();
  if (users.length === 0) {
    return res.status(404).render("404");
  }
  const pokemons = db
    .prepare(
      `
      select pokemon_id as id
      from user_pokemons
      where user_id = ?
      and user_pokemon_ext_id = ?
      order by caught_at desc
      `,
    )
    .bind(users[0].id, req.params.pokemonId)
    .all();

  if (pokemons.length === 0) {
    return res.status(404).render("404");
  }

  pokemons[0].extId = req.params.pokemonId;

  if (!req.sub) {
    return res.render("pokemon", {
      username: undefined,
      requestedPlayer: req.params.username,
      pokemon: pokemons[0],
      showReleaseBtn: false,
    });
  }

  const { username } = getUser(req.sub);
  return res.render("pokemon", {
    username,
    requestedPlayer: req.params.username,
    pokemon: pokemons[0],
    showReleaseBtn: username === req.params.username,
  });
};

export default { home, catchForm, catchHandler, players, player, pokemon };

function distance(pt1, pt2) {
  // Calculate the difference in x and y coordinates
  const dx = pt2[0] - pt1[0]; // x2 - x1
  const dy = pt2[1] - pt1[1]; // y2 - y1

  // Calculate the distance using the Pythagorean theorem
  return Math.sqrt(dx * dx + dy * dy);
}

function rollDie() {
  const r = Math.floor(Math.random() * 1_000_000) + 1;

  if (r <= 333_333) return "got away";
  else if (r <= 871_799) return "C";
  else if (r <= 950_000) return "CE";
  else if (r <= 971_799) return "CEE";
  else if (r <= 980_799) return "R";
  else if (r <= 982_799) return "RE";
  else if (r <= 983_599) return "REE";
  else if (r <= 995_599) return "T";
  else if (r <= 997_599) return "TE";
  else if (r <= 998_399) return "TEE";
  else if (r <= 999_399) return "H";
  else if (r <= 999_899) return "HE";
  else if (r <= 999_999) return "HEE";
  else return "L";
}

function getCode() {
  const codes = ["c", "a", "ar", "m"];
  const index = Math.floor(Math.random() * codes.length);
  return codes[index];
}

function getParametersAndAnswer(code) {
  if (code === "c") {
    // counting
    const randomNumber = (Math.round(Math.random() * 10) % 10) + 5;
    const centers = [];
    while (centers.length !== (1 === randomNumber ? 11 : randomNumber)) {
      const center = [
        Math.floor(Math.random() * (230 - 10 + 1)) + 10,
        Math.floor(Math.random() * (230 - 10 + 1)) + 10,
      ];

      let count = 0;
      for (let c of centers) {
        if (distance(c, center) >= 20) count++;
      }
      if (count === centers.length) centers.push(center);
    }
    return { qAnswer: randomNumber, qParameters: centers };
  } else if (code === "a") {
    // addition
    const x = Math.floor(Math.random() * 13);
    const y = Math.floor(Math.random() * 13);
    return { qAnswer: x + y, qParameters: { x, y } };
  } else if (code === "ar") {
    // repeated addition
    const x = Math.floor(Math.random() * 5) + 1;
    const n = Math.floor(Math.random() * 5) + 3;
    return { qAnswer: x * n, qParameters: { x, n } };
  } else if (code === "m") {
    // multiplication
    const x = Math.floor(Math.random() * 11);
    const y = Math.floor(Math.random() * 11);
    return { qAnswer: x * y, qParameters: { x, y } };
  }
}

function getUser(sub) {
  const users = db
    .prepare("select id, username from users where jwt_sub = ?")
    .bind(sub)
    .all();
  return users[0];
}
