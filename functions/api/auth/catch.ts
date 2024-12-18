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
