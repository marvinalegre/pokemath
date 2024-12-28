export const onRequestGet: PagesFunction = async (context) => {
  if (!Number.isInteger(Number(context.params.id)))
    return Response.json({ err: "Invalid input." });

  const { results } = await context.env.DB.prepare(
    "select name, description, color from pokemons where id = ?"
  )
    .bind(context.params.id)
    .all();

  if (results.length === 0) return Response.json({ err: "Invalid input." });

  return Response.json({
    name: results[0].name,
    description: results[0].description,
    color: results[0].color,
  });
};
