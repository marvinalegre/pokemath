import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    "select username from users"
  ).all();

  return c.json({ players: results });
});

export default app;
