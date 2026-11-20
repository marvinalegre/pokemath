export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type Tier = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

const dropRates: number[] = [
  333_333, // 0
  402_466, // 1
  178_201, // 2
  51_799, // 3
  18_000, // 4
  9_200, // 5
  4_150, // 6
  2_400, // 7
  400, // 8
  50, // 9
  1, // 10
];

export function rollTier(grade: Grade): Tier {
  const rates = dropRates.slice(0, grade + 1);
  const total = rates.reduce((sum, rate) => sum + rate, 0);
  const roll = Math.floor(Math.random() * total) + 1;

  let cumulative = 0;

  for (let i = 0; i < rates.length; i++) {
    cumulative += rates[i];
    if (roll <= cumulative) return i as Tier;
  }

  throw new Error("Invalid drop-rate table");
}
