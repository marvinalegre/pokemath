import type { QuestionType } from "~/question-types/registry";
import NumericInput from "~/components/numeric-input";

interface DivisionParams {
  max_quotient?: number; // largest answer allowed
  max_divisor?: number; // largest divisor allowed
}

export const division: QuestionType = {
  id: "division",

  generate(params: unknown) {
    const { max_quotient = 10, max_divisor = 10 } =
      (params as DivisionParams) ?? {};

    // Generate quotient and divisor first, derive dividend — guarantees whole number answers
    const quotient = Math.floor(Math.random() * (max_quotient + 1));
    const divisor = Math.floor(Math.random() * (max_divisor - 1)) + 2; // min 2, avoid ÷1 and ÷0
    const dividend = quotient * divisor;

    return {
      question_text: `${dividend} ÷ ${divisor} = ?`,
      answer: String(quotient),
    };
  },

  validate(question, answer) {
    return answer.trim() === question.answer;
  },

  component: NumericInput,
};
