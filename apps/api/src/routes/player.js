import { validateUsername } from "@pokemath/validation";
import { Hono } from "hono";

const app = new Hono();

app.get("/:username", async (c) => {
  const username = c.req.param("username");
  try {
    validateUsername(username);
  } catch (e) {
    return c.json({ err: e.message });
  }

  const { results } = await c.env.DB.prepare(
    "select id from users where username = ?"
  )
    .bind(username.toLowerCase())
    .all();

  if (results.length === 0) {
    return c.json({ err: "Resource not found." });
  }

  // TODO: use promise all
  const { results: pinned } = await c.env.DB.prepare(
    "select pokemon_id, user_pokemon_ext_id from user_pokemons where user_id = ? and pinned = 1 order by caught_at desc"
  )
    .bind(results[0].id)
    .all();

  const { results: unpinned } = await c.env.DB.prepare(
    "select pokemon_id, user_pokemon_ext_id, evolution_id from user_pokemons left join pokemons on user_pokemons.pokemon_id = pokemons.id where user_id = ? and pinned = 0 order by caught_at desc"
  )
    .bind(results[0].id)
    .all();

  // TODO: manage csrfTokens
  return c.json({
    pinned,
    unpinned,
  });
});

export default app;
