export const onRequestGet = async (context) => {
  const { results } = await context.env.DB.prepare(
    "select username from users"
  ).all();

  return Response.json({ players: results });
};
