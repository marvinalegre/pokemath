import { customAlphabet } from "nanoid";
const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
);
import db from "../database/db.js";

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

export default {
  player,
  pokemon,
  pokemonCard,
  makeOffer,
  handleOffer,
};

function getUser(sub) {
  const users = db
    .prepare("select id, username from users where jwt_sub = ?")
    .bind(sub)
    .all();
  return users[0];
}
