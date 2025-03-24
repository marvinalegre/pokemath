import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { Hono } from "hono";

import user from "./routes/user.js";
import signup from "./routes/signup.js";
import login from "./routes/login.js";
import logout from "./routes/logout.js";
import players from "./routes/players.js";
import player from "./routes/player.js";
import pokemon from "./routes/pokemon.js";
import evolve from "./routes/evolve.js";
import catchRoute from "./routes/catch.js";
import latestCatch from "./routes/latestCatch.js";

const app = new Hono();

app.use("*", (c, next) => {
  // SPA redirect

  if (c.req.path.startsWith("/api")) {
    return next();
  }

  const reqUrl = new URL(c.req.raw.url);
  return c.env.ASSETS.fetch(new URL("/index.html", reqUrl.origin));
});

app.use("/api/auth/*", async (c, next) => {
  const token = getCookie(c, "token");
  if (token == undefined) {
    return c.json({});
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
    "select id, username from users where jwt_id = ?"
  )
    .bind(jwtId)
    .all();

  c.set("userId", users[0].id);
  c.set("username", users[0].username);

  await next();
});

app.route("/api/user", user);
app.route("/api/signup", signup);
app.route("/api/login", login);
app.route("/api/logout", logout);
app.route("/api/players", players);
app.route("/api/player", player);
app.route("/api/pokemon", pokemon);
app.route("/api/auth/evolve", evolve);
app.route("/api/auth/catch", catchRoute);
app.route("/api/auth/latest", latestCatch);

export default app;
