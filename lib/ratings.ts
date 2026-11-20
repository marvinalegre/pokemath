import type { ObjectId } from "mongodb";
import { type ProblemId } from "mathforge";
import { problemGradeLevels } from "@/lib/problem-grade-levels";
import { getProblemRatings, getUsers } from "./mongodb";
import { newRating } from "./elo";
import { DEFAULT_RATING } from "@/lib/constants";

// The pool is the problems that have a seed entry. Anything not listed
// here is never selected, even if it exists in mathforge.
const candidateIds = problemGradeLevels.map((p) => p.id as ProblemId);

/** Picks the candidate problem whose rating is closest to the user's. */
export async function selectProblemId(userRating: number): Promise<ProblemId> {
  const problems = await getProblemRatings();

  const docs = await problems.find({ _id: { $in: candidateIds } }).toArray();

  if (docs.length === 0) throw new Error("No problem ratings are seeded.");

  let best = docs[0];
  let bestDistance = Math.abs(best.rating - userRating);

  for (const doc of docs.slice(1)) {
    const distance = Math.abs(doc.rating - userRating);
    if (distance < bestDistance) {
      best = doc;
      bestDistance = distance;
    }
  }

  return best._id as ProblemId;
}

export async function getUserRating(userId: ObjectId): Promise<number> {
  const users = await getUsers();
  const user = await users.findOne(
    { _id: userId },
    { projection: { rating: 1 } },
  );
  return user?.rating ?? DEFAULT_RATING;
}

export async function recordAttempt(
  userId: ObjectId,
  problemId: ProblemId,
  correct: boolean,
): Promise<void> {
  const users = await getUsers();
  const problems = await getProblemRatings();

  const user = await users.findOne(
    { _id: userId },
    { projection: { rating: 1 } },
  );
  const problem = await problems.findOne({ _id: problemId });
  if (!problem) return;

  const userRating = user?.rating ?? DEFAULT_RATING;
  const problemRating = problem.rating;

  const userScore = correct ? 1 : 0;
  const problemScore = correct ? 0 : 1;

  const nextUserRating = newRating(userRating, userScore, problemRating);
  const nextProblemRating = newRating(problemRating, problemScore, userRating);

  await Promise.all([
    users.updateOne({ _id: userId }, { $set: { rating: nextUserRating } }),
    problems.updateOne(
      { _id: problemId },
      { $set: { rating: nextProblemRating }, $inc: { attempts: 1 } },
    ),
  ]);
}
