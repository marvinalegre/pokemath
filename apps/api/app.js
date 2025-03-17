import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { verify, sign } from "hono/jwt";
import zxcvbn from "zxcvbn";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { validateUsername, validatePassword } from "@pokemath/validation";
import { reservedUsernames } from "@pokemath/reserved-usernames";

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
    "select id from users where jwt_id = ?"
  )
    .bind(jwtId)
    .all();

  c.set("userId", users[0].id);

  await next();
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

app.get("/api/logout", async (c) => {
  setCookie(c, "token", "", {
    path: "/",
    secure: true,
    httpOnly: true,
    expires: new Date(0),
    sameSite: "Strict",
  });

  return c.json({ success: true });
});

app.get("/api/players", async (c) => {
  const { results } = await c.env.DB.prepare(
    "select username from users"
  ).all();

  return c.json({ players: results });
});

app.get("/api/player/:username", async (c) => {
  const username = c.req.param("username");
  try {
    validateUsername(username);
  } catch (e) {
    return c.json({ err: e.message });
  }

  const { results } = await c.env.DB.prepare(
    "select id from users where username = ?"
  )
    .bind(username.toLowerCase())
    .all();

  if (results.length === 0) {
    return c.json({ err: "Resource not found." });
  }

  // TODO: use promise all
  const { results: pinned } = await c.env.DB.prepare(
    "select pokemon_id, user_pokemon_ext_id from user_pokemons where user_id = ? and pinned = 1 order by caught_at desc"
  )
    .bind(results[0].id)
    .all();

  const { results: unpinned } = await c.env.DB.prepare(
    "select pokemon_id, user_pokemon_ext_id from user_pokemons where user_id = ? and pinned = 0 order by caught_at desc"
  )
    .bind(results[0].id)
    .all();

  // TODO: manage csrfTokens
  return c.json({
    pinned,
    unpinned,
  });
});

app.get("/api/pokemon/:id", async (c) => {
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

app.get("/api/auth/catch", async (c) => {
  const { results } = await c.env.DB.prepare(
    "select question_code, question_parameters from user_questions where user_id = ?"
  )
    .bind(c.get("userId"))
    .all();

  if (results.length === 1)
    return c.json({
      questionCode: results[0].question_code,
      questionParameters: results[0].question_parameters,
    });

  const randomNumber = (Math.round(Math.random() * 10) % 10) + 1;
  await c.env.DB.prepare(
    "insert into user_questions (user_id, question_code, question_parameters, answer) values (?, ?, ?, ?)"
  )
    .bind(c.get("userId"), "c", String(randomNumber), String(randomNumber))
    .run();
  return c.json({
    questionCode: "c",
    questionParameters: String(randomNumber),
  });
});

app.post("/api/auth/catch", async (c) => {
  const { answer } = await c.req.json();

  const { results } = await c.env.DB.prepare(
    "select answer from user_questions where user_id = ?"
  )
    .bind(c.get("userId"))
    .all();

  if (results.length === 0 || results.length > 1)
    return c.json({ err: "Something went wrong." });
  if (results[0].answer !== answer) return c.json({ err: "Wrong answer." });

  await c.env.DB.prepare("delete from user_questions where user_id = ?")
    .bind(c.get("userId"))
    .run();

  const die = rollADie();
  if (die === "got away") return c.json({ gotaway: true });

  const { results: pokemons } = await c.env.DB.prepare(
    "select id from pokemons where availability = ?"
  )
    .bind(die)
    .all();

  const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
  const extId = nanoid();

  let experience = null;
  if (
    (
      await c.env.DB.prepare("select evolution_id from pokemons where id = ?")
        .bind(randomPokemon.id)
        .all()
    ).results[0].evolution_id
  ) {
    experience = 0;
  }

  await c.env.DB.prepare(
    "insert into user_pokemons (user_pokemon_ext_id, user_id, pokemon_id, experience) values (?, ?, ?, ?)"
  )
    .bind(extId, c.get("userId"), randomPokemon.id, experience)
    .run();

  return c.json({ caught: true });
});

app.get("/api/auth/latest", async (c) => {
  const { results } = await c.env.DB.prepare(
    "select * from user_pokemons where user_id = ? order by caught_at desc limit 1"
  )
    .bind(c.get("userId"))
    .all();

  if (results.length === 0) return c.json({ none: true });

  // TODO: manage csrfTokens
  return c.json({
    userPokemonExtId: results[0].user_pokemon_ext_id,
    pokemonId: String(results[0].pokemon_id),
    csrfToken: "oijasoidjfoisjoi",
  });
});

app.post("/api/auth/latest", async (c) => {
  const { userPokemonExtId } = await c.req.json();

  if (typeof userPokemonExtId !== "string")
    return c.json({ err: "Invalid input." });
  try {
    await c.env.DB.prepare(
      "delete from user_pokemons where user_id = ? and user_pokemon_ext_id = ?"
    )
      .bind(c.get("userId"), userPokemonExtId)
      .run();
  } catch (e) {
    return c.json({ err: "Failed to release the pokemon." });
  }

  return c.json({ success: true });
});

export default app;

function rollADie() {
  const r = Math.floor(Math.random() * 1_000_000) + 1;

  if (r <= 333_333) return "got away";
  else if (r <= 871_799) return "C";
  else if (r <= 950_000) return "CE";
  else if (r <= 971_799) return "CEE";
  else if (r <= 980_799) return "R";
  else if (r <= 982_799) return "RE";
  else if (r <= 983_599) return "REE";
  else if (r <= 995_599) return "T";
  else if (r <= 997_599) return "TE";
  else if (r <= 998_399) return "TEE";
  else if (r <= 999_399) return "H";
  else if (r <= 999_899) return "HE";
  else if (r <= 999_999) return "HEE";
  else return "L";
}
