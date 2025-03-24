import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

const app = new Hono();

app.get("/", async (c) => {
  const token = getCookie(c, "token");
  if (token == undefined) {
    return c.json({ loggedIn: false });
  }

  let jwtId;
  try {
    const decodedPayload = await verify(token, c.env.JWT_SECRET, "HS256");
    jwtId = decodedPayload.jwtId;
  } catch (e) {
    console.log(e.message);
    return c.json({ loggedIn: false });
  }

  const { results: users } = await c.env.DB.prepare(
    "select username from users where jwt_id = ?"
  )
    .bind(jwtId)
    .all();

  if (users.length === 1) {
    return c.json({ loggedIn: true, username: users[0].username });
  } else {
    return c.json({ loggedIn: false });
  }
});

export default app;
