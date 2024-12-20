export const onRequestGet: PagesFunction = async (context) => {
  // TODO: use promise all
  const { results: pinned } = await context.env.DB.prepare(
    "select pokemon_id, user_pokemon_ext_id from user_pokemons where user_id = ? and pinned = 1 order by caught_at desc"
  )
    .bind(context.data["userId"])
    .all();

  const { results: unpinned } = await context.env.DB.prepare(
    "select pokemon_id, user_pokemon_ext_id from user_pokemons where user_id = ? and pinned = 0 order by caught_at desc"
  )
    .bind(context.data["userId"])
    .all();

  // TODO: manage csrfTokens
  return Response.json({
    pinned,
    unpinned,
  });
};
