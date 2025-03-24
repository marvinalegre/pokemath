import zxcvbn from "zxcvbn";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import { reservedUsernames } from "@pokemath/reserved-usernames";
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

  if (reservedUsernames.includes(username)) {
    return c.json({ err: "This username is not available." });
  }

  const { results: users } = await c.env.DB.prepare(
    "select username from users where username = ?"
  )
    .bind(username.toLowerCase())
    .all();

  if (users.length) {
    return c.json({ err: "This username is not available." });
  }

  try {
    validatePassword(password);
  } catch (e) {
    return c.json({ err: e.message });
  }

  const zxcvbnOutput = zxcvbn(password);
  if (zxcvbnOutput.score < 3) {
    let err = "The password is weak.";
    if (zxcvbnOutput.feedback.warning) {
      err = `${err} ${zxcvbnOutput.feedback.warning}.`;
    } else if (zxcvbnOutput.feedback.suggestions.length > 0) {
      err = `${err} ${zxcvbnOutput.feedback.suggestions[0]}`;
    }
    return c.json({ err });
  }

  const hash = await bcrypt.hash(password, 10);
  const jwtId = nanoid();

  // TODO: handle collisions on jwt_id
  try {
    await c.env.DB.prepare(
      "insert into users (jwt_id, username, hashed_password) values (?, ?, ?)"
    )
      .bind(jwtId, username.toLowerCase(), hash)
      .run();
  } catch (e) {
    console.log(e.message);
    return Response.json({ err: "Something went wrong." });
  }

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
