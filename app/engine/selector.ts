import type { D1Database } from "@cloudflare/workers-types";

const MAX_RATING_DIFF = 200;
const MIN_ATTEMPTS_FOR_CALIBRATION = 20;

interface QuestionTypeRow {
  id: number;
  generator: string;
  generator_params: string;
  renderer: string;
  renderer_options: string;
  rating: number;
  attempt_count: number;
}

export async function selectQuestionType(
  userId: number,
  userRating: number,
  db: D1Database,
): Promise<QuestionTypeRow> {
  const rows = await db
    .prepare(
      `
      SELECT
        qt.id,
        qt.generator,
        qt.generator_params,
        qt.renderer,
        qt.renderer_options,
        qt.rating,
        COUNT(al.id) AS attempt_count
      FROM question_types qt
      LEFT JOIN answer_logs al ON al.question_type_id = qt.id
      WHERE qt.is_active = 1
      GROUP BY qt.id
      `,
    )
    .all<QuestionTypeRow>();

  if (!rows.results.length) {
    throw new Error("No active question types found.");
  }

  // Types with fewer than MIN_ATTEMPTS are always eligible (calibration)
  // Otherwise filter to within MAX_RATING_DIFF of the player
  const candidates = rows.results.filter(
    (qt) =>
      qt.attempt_count < MIN_ATTEMPTS_FOR_CALIBRATION ||
      Math.abs(qt.rating - userRating) <= MAX_RATING_DIFF,
  );

  // Fall back to all active types if the pool is empty
  const pool = candidates.length ? candidates : rows.results;

  return inverseDistanceWeightedPick(pool, userRating);
}

function inverseDistanceWeightedPick(
  pool: QuestionTypeRow[],
  userRating: number,
): QuestionTypeRow {
  // Weight = 1 / (distance + 1) so zero-distance types don't get infinite weight
  const weights = pool.map((qt) => 1 / (Math.abs(qt.rating - userRating) + 1));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  let random = Math.random() * totalWeight;

  for (let i = 0; i < pool.length; i++) {
    random -= weights[i];
    if (random <= 0) return pool[i];
  }

  // Floating point fallback — should never be reached
  return pool[pool.length - 1];
}
