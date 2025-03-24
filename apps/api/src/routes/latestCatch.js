import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    "select * from user_pokemons where user_id = ? order by caught_at desc limit 1"
  )
    .bind(c.get("userId"))
    .all();

  if (results.length === 0) return c.json({ none: true });

  // TODO: manage csrfTokens
  return c.json({
    userPokemonExtId: results[0].user_pokemon_ext_id,
    pokemonId: String(results[0].pokemon_id),
    csrfToken: "oijasoidjfoisjoi",
  });
});

app.post("/", async (c) => {
  const { userPokemonExtId } = await c.req.json();

  if (typeof userPokemonExtId !== "string")
    return c.json({ err: "Invalid input." });
  try {
    await c.env.DB.prepare(
      "delete from user_pokemons where user_id = ? and user_pokemon_ext_id = ?"
    )
      .bind(c.get("userId"), userPokemonExtId)
      .run();
  } catch (e) {
    return c.json({ err: "Failed to release the pokemon." });
  }

  return c.json({ success: true });
});

export default app;
