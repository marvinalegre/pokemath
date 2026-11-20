const K = 16;

export function expectedScore(
  ownRating: number,
  opponentRating: number,
): number {
  return 1 / (1 + Math.pow(10, (opponentRating - ownRating) / 400));
}

export function newRating(
  oldRating: number,
  score: 0 | 1,
  opponentRating: number,
): number {
  return Math.round(
    oldRating + K * (score - expectedScore(oldRating, opponentRating)),
  );
}
