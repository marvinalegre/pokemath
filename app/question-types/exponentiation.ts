import type { QuestionType } from "~/question-types/registry";
import NumericInput from "~/components/NumericInput";

interface ExponentiationParams {
  max_base?: number;
  max_exponent?: number;
  min_exponent?: number; // default 2, set to 1 to include trivial x^1 questions
}

export const exponentiation: QuestionType = {
  id: "exponentiation",

  generate(params: unknown) {
    const {
      max_base = 10,
      max_exponent = 2,
      min_exponent = 2,
    } = (params as ExponentiationParams) ?? {};

    const base = Math.floor(Math.random() * (max_base - 1)) + 2; // min base 2, avoid 0^n and 1^n trivia
    const exponent =
      Math.floor(Math.random() * (max_exponent - min_exponent + 1)) +
      min_exponent;

    const answer = Math.pow(base, exponent);
    const superscript = toSuperscript(exponent);

    return {
      question_text: `${base}${superscript} = ?`,
      answer: String(answer),
    };
  },

  validate(question, answer) {
    return answer.trim() === question.answer;
  },

  component: NumericInput,
};

function toSuperscript(n: number): string {
  const map: Record<string, string> = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
  };
  return String(n)
    .split("")
    .map((d) => map[d])
    .join("");
}
