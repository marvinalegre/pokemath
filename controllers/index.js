import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
);
import db from "../database/db.js";
import { bot, chatId } from "../telegram-bot.js";

const home = (req, res) => {
  if (!req.cookies.token) {
    res.render("home", { username: undefined });
    return;
  }

  let decoded;
  try {
    decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  } catch (e) {
    res.render("home", { username: undefined });
    return;
  }

  const result = db
    .prepare("select * from users where jwt_sub = ?")
    .bind(decoded.sub)
    .all();
  res.render("home", { username: result[0].username });
};

const catchForm = (req, res) => {
  const result = db
    .prepare(
      "select question_code, question_parameters from user_questions where user_id = ?",
    )
    .bind(req.user.id)
    .all();

  if (result.length === 1) {
    return res.render(`questions/${result[0].question_code}`, {
      username: req.user.username,
      generalError: undefined,
      qParameters: JSON.parse(result[0].question_parameters),
    });
  }

  const qCode = getCode();
  const { qParameters, qAnswer } = getParametersAndAnswer(qCode);

  res.render(`questions/${qCode}`, {
    username: req.user.username,
    generalError: undefined,
    qParameters,
  });

  db.prepare(
    "insert into user_questions (user_id, question_code, question_parameters, answer) values (?, ?, ?, ?)",
  )
    .bind(req.user.id, qCode, JSON.stringify(qParameters), String(qAnswer))
    .run();
};

const catchHandler = async (req, res) => {
  const { answer } = req.body;
  const { id, username } = req.user;

  const result = db
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
      result[0].answer,
      result[0].question_code,
      result[0].question_parameters,
    )
    .run();

  if (result[0].answer !== answer) {
    return res.render(`questions/${result[0].question_code}`, {
      username,
      generalError: "Wrong answer.",
      qParameters: JSON.parse(result[0].question_parameters),
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
      .bind(req.user.id, qCode, JSON.stringify(qParameters), String(qAnswer))
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

  let decoded;
  try {
    decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  } catch (e) {
    return res.render("players", {
      username: undefined,
      players,
    });
  }

  const result = db
    .prepare("select username from users where jwt_sub = ?")
    .bind(decoded.sub)
    .all();
  res.render("players", { players, username: result[0].username });
};

const player = (req, res) => {
  const users = db
    .prepare("select id from users where username = ?")
    .bind(req.params.username.toLowerCase())
    .all();
  if (!users.length) {
    return res.status(404).send("Page not found");
  }

  const pokemons = db
    .prepare(
      "select pokemon_id as id from user_pokemons where user_id = ? order by caught_at desc",
    )
    .bind(users[0].id)
    .all();

  let decoded;
  try {
    decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  } catch (e) {
    return res.render("player", {
      username: undefined,
      requestedPlayer: req.params.username,
      pokemons,
    });
  }

  const result = db
    .prepare("select * from users where jwt_sub = ?")
    .bind(decoded.sub)
    .all();
  res.render("player", {
    username: result[0].username,
    requestedPlayer: req.params.username,
    pokemons,
  });
};

export default { home, catchForm, catchHandler, players, player };

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
  const codes = ["c", "a", "ar"];
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
  }
}
