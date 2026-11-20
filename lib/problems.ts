import { forge, ids, type Problem, type ProblemId } from "mathforge";

export function pickProblemId(): ProblemId {
  const problemIds = ids();
  return problemIds[Math.floor(Math.random() * problemIds.length)];
}

export function newProblem(id: ProblemId = pickProblemId()): Problem {
  const { data, answer } = forge(id);
  // forge returns the matching shape for id. The cast is needed because
  // TypeScript can't narrow a union from a runtime value.
  return { id, data, answer } as Problem;
}

// Exhaustive switch: a new ProblemId without a case is a compile error.
export function problemLatex(problem: Problem): string {
  switch (problem.id) {
    case "addition-single-digit-no-carry":
    case "addition-single-digit-carry":
      return `${problem.data.a} + ${problem.data.b} = \\; ?`;
  }
}
