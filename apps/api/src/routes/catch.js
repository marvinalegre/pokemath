import { nanoid } from "nanoid";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
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

app.post("/", async (c) => {
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
