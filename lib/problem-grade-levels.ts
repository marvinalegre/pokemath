export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const problemGradeLevels = [
  { id: "addition-single-digit-no-carry", rating: 700, gradeLevel: 1 },
  { id: "addition-single-digit-carry", rating: 720, gradeLevel: 1 },
  { id: "addition-single-double-digit-under-20", rating: 740, gradeLevel: 1 },
  { id: "addition-double-digit-under-100", rating: 760, gradeLevel: 1 },
  { id: "addition-two-digit-three-digit", rating: 840, gradeLevel: 2 },
  { id: "addition-two-digit-four-digit", rating: 860, gradeLevel: 3 },
  { id: "addition-four-digit-four-digit", rating: 920, gradeLevel: 3 },
  { id: "addition-four-digit-five-digit", rating: 980, gradeLevel: 4 },
  { id: "addition-four-digit-six-digit", rating: 1040, gradeLevel: 4 },
  { id: "subtraction-single-digit-no-borrow", rating: 780, gradeLevel: 1 },
  {
    id: "subtraction-double-single-digit-under-20",
    rating: 800,
    gradeLevel: 1,
  },
  { id: "subtraction-double-digit-under-100", rating: 820, gradeLevel: 1 },
  { id: "subtraction-two-digit-three-digit", rating: 880, gradeLevel: 2 },
  { id: "subtraction-two-digit-four-digit", rating: 940, gradeLevel: 3 },
  { id: "subtraction-four-digit-four-digit", rating: 1000, gradeLevel: 3 },
  { id: "subtraction-four-digit-five-digit", rating: 1020, gradeLevel: 4 },
  { id: "subtraction-four-digit-six-digit", rating: 1060, gradeLevel: 4 },
  { id: "multiplication-by-2-3-4-5-10", rating: 900, gradeLevel: 2 },
  { id: "multiplication-by-6-7-8-9", rating: 960, gradeLevel: 3 },
  {
    id: "multiplication-product-up-to-1-million",
    rating: 1120,
    gradeLevel: 4,
  },
  { id: "division-by-2-3-4-5-10", rating: 1080, gradeLevel: 2 },
  { id: "division-by-6-7-8-9", rating: 1100, gradeLevel: 3 },
  { id: "division-2digit-by-1digit-remainder", rating: 1300, gradeLevel: 3 },
  { id: "division-3digit-by-1digit", rating: 1140, gradeLevel: 3 },
  { id: "division-4digit-by-2digit", rating: 1160, gradeLevel: 4 },
] as const;

export type ProblemGradeLevel = (typeof problemGradeLevels)[number];
export type ProblemId = ProblemGradeLevel["id"];

const byId = new Map<string, ProblemGradeLevel>(
  problemGradeLevels.map((p) => [p.id, p]),
);

export function getQuestionGradeInfo(id: ProblemId): ProblemGradeLevel;
export function getQuestionGradeInfo(id: string): ProblemGradeLevel | undefined;
export function getQuestionGradeInfo(
  id: string,
): ProblemGradeLevel | undefined {
  return byId.get(id);
}

export function getRating(id: ProblemId): number;
export function getRating(id: string): number | undefined;
export function getRating(id: string): number | undefined {
  return byId.get(id)?.rating;
}

export function gradeOf(id: ProblemId): Grade;
export function gradeOf(id: string): Grade | undefined;
export function gradeOf(id: string): Grade | undefined {
  return byId.get(id)?.gradeLevel;
}
