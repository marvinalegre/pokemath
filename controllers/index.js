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

const makeOffer = (req, res) => {
  const { username, id } = req.user;

  const users = db
    .prepare("select id from users where username = ?")
    .bind(req.params.username)
    .all();
  if (users.length === 0) {
    return res.status(404).render("404");
  }

  const recipientPokemons = db
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
  if (recipientPokemons.length === 0) {
    return res.status(404).render("404");
  }

  const initiatorPokemons = db
    .prepare(
      "select pokemon_id as id, user_pokemon_ext_id as ext_id from user_pokemons where user_id = ? order by caught_at desc",
    )
    .bind(id)
    .all();

  return res.render("make-offer", {
    username,
    requestedPlayer: req.params.username,
    pokemons: initiatorPokemons,
    recipientPokemon: recipientPokemons[0],
  });
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

const pokemonCard = (req, res) => {
  const { username: requestedPlayer, pokemonId } = req.params;
  const users = db
    .prepare("select id from users where username = ?")
    .bind(requestedPlayer)
    .all();
  if (users.length === 0) {
    return res.status(404).render("404");
  }

  const pokemons = db
    .prepare(
      `
      select pokemon_id as id, name, description, color
      from user_pokemons
      left join pokemons
      on pokemons.id = user_pokemons.pokemon_id
      where user_id = ?
      and user_pokemon_ext_id = ?
      order by caught_at desc
      `,
    )
    .bind(users[0].id, pokemonId)
    .all();
  if (pokemons.length === 0) {
    return res.status(404).render("404");
  }

  if (!req.sub) {
    return res.render("pokemon-card", {
      username: undefined,
      requestedPlayer: req.params.username,
      pokemon: pokemons[0],
    });
  }

  const { username } = getUser(req.sub);
  return res.render("pokemon-card", {
    username,
    requestedPlayer: req.params.username,
    pokemon: pokemons[0],
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
      showOfferBtn: false,
    });
  }

  const { username } = getUser(req.sub);
  return res.render("pokemon", {
    username,
    requestedPlayer: req.params.username,
    pokemon: pokemons[0],
    showReleaseBtn: username === req.params.username,
    showOfferBtn: username !== req.params.username,
  });
};

const handleOffer = (req, res) => {
  const { id } = req.user;

  const users = db
    .prepare("select id from users where username = ?")
    .bind(req.params.username)
    .all();
  if (users.length === 0) {
    return res.status(500).end();
  }

  const pokemons = db
    .prepare(
      "select pokemon_id from user_pokemons where user_pokemon_ext_id = ?",
    )
    .bind(req.params.pokemonId)
    .all();
  if (pokemons.length === 0) {
    return res.status(500).end();
  }

  const tradeId = nanoid();
  const trade = db
    .prepare(
      "insert into trades (initiator_id, recipient_id, trade_ext_id, pokemon_id) values(?, ?, ?, ?)",
    )
    .bind(id, users[0].id, tradeId, pokemons[0].pokemon_id)
    .run();

  const insertStmt = db.prepare(
    "insert into trade_items (trade_id, user_id, user_pokemon_id) values(?, ?, ?)",
  );
  const insertItems = db.transaction((items) => {
    for (const item of items) {
      insertStmt.run(...item);
    }
  });
  const tradeItems = req.body.map((extId) => [
    trade.lastInsertRowid,
    id,
    getUserPokemonId(extId).id,
  ]);
  tradeItems.push([
    trade.lastInsertRowid,
    users[0].id,
    getUserPokemonId(req.params.pokemonId).id,
  ]);
  insertItems(tradeItems);

  function getUserPokemonId(extId) {
    return db
      .prepare("select id from user_pokemons where user_pokemon_ext_id = ?")
      .bind(extId)
      .all()[0];
  }

  return res.json({ success: true, tradeId });
};

const tradeDetails = (req, res) => {
  const { username, id } = req.user;

  const trades = db
    .prepare(
      "select id, recipient_id, initiator_id, status from trades where trade_ext_id = ?",
    )
    .bind(req.params.tradeId)
    .all();
  if (trades.length === 0) {
    return res.status(404).render("404");
  }

  const tradeItems = db
    .prepare(
      `
      select trade_items.user_id, user_pokemon_ext_id, pokemon_id from trade_items
      left join user_pokemons on trade_items.user_pokemon_id = user_pokemons.id
      where trade_id = ?
      `,
    )
    .bind(trades[0].id)
    .all();
  const recipientItems = tradeItems
    .filter((i) => i.user_id === trades[0].recipient_id)
    .map((i) => ({ id: i.pokemon_id, ext_id: i.user_pokemon_ext_id }));
  const initiatorItems = tradeItems
    .filter((i) => i.user_id === trades[0].initiator_id)
    .map((i) => ({ id: i.pokemon_id, ext_id: i.user_pokemon_ext_id }));

  res.render("trade-details", {
    username,
    tradeId: req.params.tradeId,
    recipientUsername: getUsername(trades[0].recipient_id),
    initiatorUsername: getUsername(trades[0].initiator_id),
    recipientPokemon: recipientItems[0],
    pokemons: initiatorItems,
    status: trades[0].status,
    showCancelBtn:
      trades[0].status === "pending" && id === trades[0].initiator_id
        ? true
        : false,
    showRecipientBtns:
      trades[0].status === "pending" && id !== trades[0].initiator_id
        ? true
        : false,
  });
};

const trades = (req, res) => {
  const { username, id } = req.user;

  let trades = db
    .prepare(
      "select trade_ext_id, recipient_id, initiator_id, pokemon_id, status from trades order by created_at desc",
    )
    .all();
  trades = trades.map((t) => ({
    id: t.trade_ext_id,
    player: getUsername(
      t.recipient_id === id ? t.initiator_id : t.recipient_id,
    ),
    status: t.status,
    pokemonId: t.pokemon_id,
  }));

  res.render("trades", {
    username,
    trades,
  });
};

const handleTrade = (req, res) => {
  let newStatus;
  if (req.body.action === "cancel") {
    newStatus = "cancelled";
  } else if (req.body.action === "reject") {
    newStatus = "rejected";
  } else if (req.body.action === "accept") {
    let proceed = true;
    const tradeItems = db
      .prepare(
        `
        select user_id, user_pokemon_id from trades
        left join trade_items on trades.id = trade_items.trade_id
        where trade_ext_id = ?
        `,
      )
      .bind(req.params.tradeId)
      .all();
    if (trades.length === 0) {
      return res.redirect("/logout");
    }

    for (const item of tradeItems) {
      const result = db
        .prepare("select * from user_pokemons where id = ? and user_id = ?")
        .bind(item.user_pokemon_id, item.user_id)
        .all();
      if (result.length === 0) {
        proceed = false;
        break;
      }
    }

    if (!proceed) {
      newStatus = "cancelled";
    }

    const [trade] = db
      .prepare("select * from trades where trade_ext_id = ?")
      .bind(req.params.tradeId)
      .all();
    tradeItems.forEach((i) => {
      if (i.user_id === trade.recipient_id) {
        db.prepare("update user_pokemons set user_id = ? where id = ?")
          .bind(trade.initiator_id, i.user_pokemon_id)
          .run();
      } else {
        db.prepare("update user_pokemons set user_id = ? where id = ?")
          .bind(trade.recipient_id, i.user_pokemon_id)
          .run();
      }
    });
    newStatus = "completed";
  }

  db.prepare("update trades set status = ? where trade_ext_id = ?")
    .bind(newStatus, req.params.tradeId)
    .run();
  res.redirect(`/trades/${req.params.tradeId}`);
};

export default {
  home,
  catchForm,
  catchHandler,
  players,
  player,
  pokemon,
  pokemonCard,
  makeOffer,
  handleOffer,
  trades,
  tradeDetails,
  handleTrade,
};

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

function getUsername(id) {
  return db.prepare("select username from users where id = ?").bind(id).all()[0]
    .username;
}
