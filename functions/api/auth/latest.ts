export const onRequestGet: PagesFunction = async (context) => {
  const { results } = await context.env.DB.prepare(
    "select * from user_pokemons where user_id = ? order by caught_at desc limit 1"
  )
    .bind(context.data["userId"])
    .all();

  if (results.length === 0) return Response.json({ none: true });

  // TODO: manage csrfTokens
  return Response.json({
    userPokemonExtId: results[0].user_pokemon_ext_id,
    pokemonId: String(results[0].pokemon_id),
    csrfToken: "oijasoidjfoisjoi",
  });
};

export const onRequestPost: PagesFunction = async (context) => {
  const { userPokemonExtId } = await context.request.json();

  if (typeof userPokemonExtId !== "string")
    return Response.json({ err: "Invalid input." });
  try {
    await context.env.DB.prepare(
      "delete from user_pokemons where user_id = ? and user_pokemon_ext_id = ?"
    )
      .bind(context.data["userId"], userPokemonExtId)
      .run();
  } catch (e) {
    return Response.json({ err: "Failed to release the pokemon." });
  }

  return Response.json({ success: true });
};
