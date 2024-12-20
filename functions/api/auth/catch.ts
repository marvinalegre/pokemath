import { nanoid } from "nanoid";

export const onRequestGet: PagesFunction = async (context) => {
  const { results } = await context.env.DB.prepare(
    "select question_code, question_parameters from user_questions where user_id = ?"
  )
    .bind(context.data["userId"])
    .all();

  if (results.length === 1)
    return Response.json({
      questionCode: results[0].question_code,
      questionParameters: results[0].question_parameters,
    });

  const randomNumber = (Math.round(Math.random() * 10) % 5) + 1;
  await context.env.DB.prepare(
    "insert into user_questions (user_id, question_code, question_parameters, answer) values (?, ?, ?, ?)"
  )
    .bind(
      context.data["userId"],
      "c",
      String(randomNumber),
      String(randomNumber)
    )
    .run();
  return Response.json({
    questionCode: "c",
    questionParameters: String(randomNumber),
  });
};

export const onRequestPost: PagesFunction = async (context) => {
  const { answer } = (await context.request.json()) as {
    answer: string;
  };

  const { results } = await context.env.DB.prepare(
    "select answer from user_questions where user_id = ?"
  )
    .bind(context.data["userId"])
    .all();

  if (results.length === 0 || results.length > 1)
    return Response.json({ err: "Something went wrong." });
  if (results[0].answer !== answer)
    return Response.json({ err: "Wrong answer. -server" });

  const die = rollADie();
  if (die === "got away") return Response.json({ gotaway: true });

  const { results: pokemons } = await context.env.DB.prepare(
    "select id from pokemons where availability = ?"
  )
    .bind(die)
    .all();

  const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
  const extId = nanoid();

  await context.env.DB.prepare(
    "insert into user_pokemons (user_pokemon_ext_id, user_id, pokemon_id) values (?, ?, ?)"
  )
    .bind(extId, context.data["userId"], randomPokemon.id)
    .run();
  await context.env.DB.prepare("delete from user_questions where user_id = ?")
    .bind(context.data["userId"])
    .run();

  return Response.json({ caught: true });
};

function rollADie() {
  const r = Math.floor(Math.random() * 1_000_000) + 1;

  if (r <= 333_333) return "got away";
  else if (r <= 771_799) return "C";
  else if (r <= 971_799) return "E";
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
