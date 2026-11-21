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
    case "addition-single-double-digit-under-20":
    case "addition-double-digit-under-100":
    case "addition-two-digit-three-digit":
    case "addition-two-digit-four-digit":
    case "addition-four-digit-four-digit":
    case "addition-four-digit-five-digit":
    case "addition-four-digit-six-digit":
      return `${problem.data.a} + ${problem.data.b} = \\; ?`;

    case "subtraction-single-digit-no-borrow":
    case "subtraction-double-single-digit-under-20":
    case "subtraction-double-digit-under-100":
    case "subtraction-two-digit-three-digit":
    case "subtraction-two-digit-four-digit":
    case "subtraction-four-digit-four-digit":
    case "subtraction-four-digit-five-digit":
    case "subtraction-four-digit-six-digit":
      return `${problem.data.a} - ${problem.data.b} = \\; ?`;

    case "multiplication-by-2-3-4-5-10":
    case "multiplication-by-6-7-8-9":
    case "multiplication-product-up-to-1-million":
      return `${problem.data.a} × ${problem.data.b} = \\; ?`;

    case "division-by-2-3-4-5-10":
    case "division-by-6-7-8-9":
    case "division-3digit-by-1digit":
    case "division-4digit-by-2digit":
      return `${problem.data.a} ÷ ${problem.data.b} = \\; ?`;

    case "division-2digit-by-1digit-remainder":
      return `${problem.data.a} % ${problem.data.b} = \\; ?`;
  }
}
