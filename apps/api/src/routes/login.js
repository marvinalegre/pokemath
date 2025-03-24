import bcrypt from "bcryptjs";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { validateUsername, validatePassword } from "@pokemath/validation";
import { Hono } from "hono";

const app = new Hono();

app.post("/", async (c) => {
  const { username, password } = await c.req.json();

  try {
    validateUsername(username);
  } catch (e) {
    return c.json({ err: e.message });
  }

  const { results: users } = await c.env.DB.prepare(
    "select username, hashed_password, jwt_id from users where username = ?"
  )
    .bind(username.toLowerCase())
    .all();

  if (!users.length) return c.json({ err: "Incorrect username or password." });

  try {
    validatePassword(password);
  } catch (e) {
    return c.json({ err: e.message });
  }

  if (!(await bcrypt.compare(password, users[0].hashed_password)))
    return c.json({ err: "Incorrect username or password." });

  const jwtId = users[0].jwt_id;
  const token = await sign({ jwtId }, c.env.JWT_SECRET);
  setCookie(c, "token", token, {
    path: "/",
    secure: true,
    httpOnly: true,
    expires: new Date(Date.now() + 2_592_000_000 * 3),
    sameSite: "Strict",
  });

  return c.json({ success: true });
});

export default app;
