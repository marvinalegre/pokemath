import { Hono } from "hono";

const app = new Hono();

app.get("/:id", async (c) => {
  if (!Number.isInteger(Number(c.req.param("id")))) {
    return c.json({ err: "Invalid input." });
  }

  const { results } = await c.env.DB.prepare(
    "select name, description, color from pokemons where id = ?"
  )
    .bind(c.req.param("id"))
    .all();

  if (results.length === 0) {
    return c.json({ err: "Invalid input." });
  }

  return c.json({
    name: results[0].name,
    description: results[0].description,
    color: results[0].color,
  });
});

export default app;
