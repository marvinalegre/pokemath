import { selectQuestionType } from "./selector";
import { updateElo } from "./elo";
import { getQuestionType } from "~/question-types/registry";

// --- Types ---

export interface ActiveQuestion {
  question_type_id: number;
  generator: string;
  generator_params: string;
  renderer: string;
  renderer_options: string;
  question_text: string;
  answer: string;
  assigned_at: string;
}

export interface SubmitResult {
  correct: boolean;
}

// --- Load or generate the active question for a user ---

export async function loadActiveQuestion(
  userId: number,
  userRating: number,
  db: D1Database,
): Promise<ActiveQuestion> {
  const existing = await db
    .prepare(
      `
      SELECT
        aq.question_type_id,
        qt.generator,
        qt.generator_params,
        qt.renderer,
        qt.renderer_options,
        aq.question_text,
        aq.answer,
        aq.assigned_at
      FROM active_questions aq
      JOIN question_types qt ON qt.id = aq.question_type_id
      WHERE aq.user_id = ?
      `,
    )
    .bind(userId)
    .first<ActiveQuestion>();

  if (existing) return existing;

  return generateNextQuestion(userId, userRating, db);
}

// --- Submit an answer ---

export async function submitAnswer(
  userId: number,
  userRating: number,
  userAnswer: string,
  db: D1Database,
): Promise<SubmitResult> {
  const active = await db
    .prepare(
      `
      SELECT
        aq.question_type_id,
        qt.generator,
        qt.generator_params,
        aq.question_text,
        aq.answer
      FROM active_questions aq
      JOIN question_types qt ON qt.id = aq.question_type_id
      WHERE aq.user_id = ?
      `,
    )
    .bind(userId)
    .first<ActiveQuestion>();

  if (!active) {
    throw new Error(`No active question found for user ${userId}.`);
  }

  const questionType = getQuestionType(active.generator);
  if (!questionType) {
    throw new Error(`Unregistered question type: ${active.generator}`);
  }

  const correct = questionType.validate(
    { question_text: active.question_text, answer: active.answer },
    userAnswer,
  );

  // Always log the attempt
  await db
    .prepare(
      `
      INSERT INTO answer_logs
        (user_id, question_type_id, question_text, user_answer, correct_answer, is_correct)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
    )
    .bind(
      userId,
      active.question_type_id,
      active.question_text,
      userAnswer,
      active.answer,
      correct ? 1 : 0,
    )
    .run();

  // Always update ELO
  await updateElo(userId, active.question_type_id, correct, db);

  if (correct) {
    // Delete active question so the next load generates a fresh one
    await db
      .prepare(`DELETE FROM active_questions WHERE user_id = ?`)
      .bind(userId)
      .run();
  }

  return { correct };
}

// --- Internal: select + generate + upsert ---

async function generateNextQuestion(
  userId: number,
  userRating: number,
  db: D1Database,
): Promise<ActiveQuestion> {
  const questionTypeRow = await selectQuestionType(userId, userRating, db);

  const questionType = getQuestionType(questionTypeRow.generator);
  if (!questionType) {
    throw new Error(`Unregistered question type: ${questionTypeRow.generator}`);
  }

  const params = JSON.parse(questionTypeRow.generator_params ?? "{}");
  const generated = questionType.generate(params);

  await db
    .prepare(
      `
      INSERT INTO active_questions
        (user_id, question_type_id, question_text, answer)
      VALUES (?, ?, ?, ?)
      ON CONFLICT (user_id) DO UPDATE SET
        question_type_id = excluded.question_type_id,
        question_text    = excluded.question_text,
        answer           = excluded.answer,
        assigned_at      = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
      `,
    )
    .bind(userId, questionTypeRow.id, generated.question_text, generated.answer)
    .run();

  return {
    question_type_id: questionTypeRow.id,
    generator: questionTypeRow.generator,
    generator_params: questionTypeRow.generator_params,
    renderer: questionTypeRow.renderer,
    renderer_options: questionTypeRow.renderer_options,
    question_text: generated.question_text,
    answer: generated.answer,
    assigned_at: new Date().toISOString(),
  };
}
