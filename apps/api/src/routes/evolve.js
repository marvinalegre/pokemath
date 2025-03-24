import { Hono } from "hono";

const app = new Hono();

app.get("/:userpokemon", async (c) => {
  const userpokemon = c.req.param("userpokemon");
  const { results } = await c.env.DB.prepare(
    "select * from user_pokemons left join pokemons on user_pokemons.pokemon_id = pokemons.id where user_pokemon_ext_id = ? and user_id = ? "
  )
    .bind(userpokemon, c.get("userId"))
    .all();

  if (results.length === 0) {
    return c.json({ unauthorized: true });
  } else {
    return c.json({
      pokemon: {
        id: results[0].id,
        experience: results[0].experience,
        evolution_condition: results[0].evolution_condition,
      },
    });
  }
});

app.post("/", async (c) => {
  // TODO: make a more secure version. the user pokemon id should not be
  // given by the clientside.
  const { answer, userPokemonId } = await c.req.json();

  const { results } = await c.env.DB.prepare(
    "select answer from user_questions where user_id = ?"
  )
    .bind(c.get("userId"))
    .all();

  if (results.length === 0 || results.length > 1)
    return c.json({ err: "Something went wrong." });
  if (results[0].answer !== answer) return c.json({ err: "Wrong answer." });

  await c.env.DB.prepare("delete from user_questions where user_id = ?")
    .bind(c.get("userId"))
    .run();

  const { results: pokemons } = await c.env.DB.prepare(
    "select experience, evolution_condition from user_pokemons left join pokemons on user_pokemons.pokemon_id = pokemons.id where user_pokemon_ext_id = ?"
  )
    .bind(userPokemonId)
    .all();
  if (pokemons.length === 1) {
    if (pokemons[0].experience + 1 === pokemons[0].evolution_condition) {
      const { results: pokemons } = await c.env.DB.prepare(
        "select evolution_id from user_pokemons left join pokemons on user_pokemons.pokemon_id = pokemons.id where user_pokemon_ext_id = ?"
      )
        .bind(userPokemonId)
        .all();

      let experience = null;
      if (
        (
          await c.env.DB.prepare(
            "select evolution_id from pokemons where id = ?"
          )
            .bind(pokemons[0].evolution_id)
            .all()
        ).results[0].evolution_id
      ) {
        experience = 0;
      }

      await c.env.DB.prepare(
        "update user_pokemons set experience = ?, pokemon_id = ? where user_pokemon_ext_id = ?"
      )
        .bind(experience, pokemons[0].evolution_id, userPokemonId)
        .run();

      return c.json({ evolved: true, username: c.get("username") });
    } else {
      await c.env.DB.prepare(
        "update user_pokemons set experience = ? where user_pokemon_ext_id = ?"
      )
        .bind(Number(pokemons[0].experience) + 1, userPokemonId)
        .run();
      return c.json({ success: true });
    }
  } else {
    return c.json({ err: "Something went wrong." });
  }
});

export default app;
