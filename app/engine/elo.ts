const K = 32;

function expectedScore(ownRating: number, opponentRating: number): number {
  return 1 / (1 + Math.pow(10, (opponentRating - ownRating) / 400));
}

function newRating(
  oldRating: number,
  score: 0 | 1,
  opponentRating: number,
): number {
  return oldRating + K * (score - expectedScore(oldRating, opponentRating));
}

export async function updateElo(
  userId: number,
  questionTypeId: number,
  correct: boolean,
  db: D1Database,
): Promise<{ updatedUserRating: number }> {
  const user = await db
    .prepare(`SELECT rating FROM users WHERE id = ?`)
    .bind(userId)
    .first<{ rating: number }>();

  const questionType = await db
    .prepare(`SELECT rating FROM question_types WHERE id = ?`)
    .bind(questionTypeId)
    .first<{ rating: number }>();

  if (!user) throw new Error(`User ${userId} not found.`);
  if (!questionType)
    throw new Error(`Question type ${questionTypeId} not found.`);

  // Player wins (score=1) on correct answer, question wins (score=1) on wrong answer
  const playerScore: 0 | 1 = correct ? 1 : 0;
  const questionScore: 0 | 1 = correct ? 0 : 1;

  const updatedPlayerRating = newRating(
    user.rating,
    playerScore,
    questionType.rating,
  );
  const updatedQuestionRating = newRating(
    questionType.rating,
    questionScore,
    user.rating,
  );

  await db.batch([
    db
      .prepare(`UPDATE users SET rating = ? WHERE id = ?`)
      .bind(updatedPlayerRating, userId),
    db
      .prepare(`UPDATE question_types SET rating = ? WHERE id = ?`)
      .bind(updatedQuestionRating, questionTypeId),
  ]);

  return { updatedUserRating: updatedPlayerRating };
}
