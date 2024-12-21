import { validateUsername } from "../../../app/utils/validateUsername.ts";

export const onRequestGet = async (context) => {
  const validationResult = validateUsername(context.params.username);
  if (validationResult !== "Username is valid.")
    return Response.json({ err: validationResult });

  const { results } = await context.env.DB.prepare(
    "select id from users where username = ?"
  )
    .bind(context.params.username)
    .all();

  if (results.length === 0) return Response.json({ err: "Resource not found" });

  // TODO: use promise all
  const { results: pinned } = await context.env.DB.prepare(
    "select pokemon_id, user_pokemon_ext_id from user_pokemons where user_id = ? and pinned = 1 order by caught_at desc"
  )
    .bind(results[0].id)
    .all();

  const { results: unpinned } = await context.env.DB.prepare(
    "select pokemon_id, user_pokemon_ext_id from user_pokemons where user_id = ? and pinned = 0 order by caught_at desc"
  )
    .bind(results[0].id)
    .all();

  // TODO: manage csrfTokens
  return Response.json({
    pinned,
    unpinned,
  });
};
