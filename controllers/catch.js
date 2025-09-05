import db from "../database/db.js";

const latest = (req, res) => {
  const { id, username } = req.user;
  const result = db
    .prepare(
      "select * from user_pokemons where user_id = ? order by caught_at desc limit 1",
    )
    .bind(id)
    .all();

  if (result.length === 0) {
    return res.render("latest-catch", { username });
  }

  // TODO: manage csrfTokens
  res.render("latest-catch", {
    username,
    pokemonId: result[0].pokemon_id,
    pokemonExtId: result[0].user_pokemon_ext_id,
  });
};

const dealWithLatest = (req, res) => {
  if (req.body.release === "true") {
    db.prepare(
      "delete from user_pokemons where user_id = ? and user_pokemon_ext_id = ?",
    )
      .bind(req.user.id, req.body.pokemonExtId)
      .run();
  }
  if (req.body.redirect) {
    return res.redirect(req.body.redirect);
  }
  res.redirect("/catch");
};

export default { latest, dealWithLatest };
