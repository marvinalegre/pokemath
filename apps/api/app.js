import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { verify, sign } from "hono/jwt";
import zxcvbn from "zxcvbn";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { validateUsername, validatePassword } from "@pokemath/validation";

const app = new Hono();

app.use("*", (c, next) => {
  // SPA redirect

  if (c.req.path.startsWith("/api")) {
    return next();
  }

  return c.env.ASSETS.fetch(new URL("/index.html", reqUrl.origin));
});

app.get("/api/user", async (c) => {
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

app.post("/api/signup", async (c) => {
  const { username, password } = await c.req.json();

  try {
    validateUsername(username);
  } catch (e) {
    return c.json({ err: e.message });
  }

  const { results: users } = await c.env.DB.prepare(
    "select username from users where username = ?"
  )
    .bind(username)
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
      .bind(jwtId, username, hash)
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

app.post("/api/login", async (c) => {
  const { username, password } = await c.req.json();

  try {
    validateUsername(username);
  } catch (e) {
    return c.json({ err: e.message });
  }

  const { results: users } = await c.env.DB.prepare(
    "select username, hashed_password, jwt_id from users where username = ?"
  )
    .bind(username)
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
