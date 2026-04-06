import type { QuestionType } from "~/question-types/registry";
import NumericInput from "~/components/NumericInput";

interface MultiplicationParams {
  max_factor_a?: number;
  max_factor_b?: number;
}

export const multiplication: QuestionType = {
  id: "multiplication",

  generate(params: unknown) {
    const { max_factor_a = 10, max_factor_b = 10 } =
      (params as MultiplicationParams) ?? {};

    const a = Math.floor(Math.random() * (max_factor_a + 1));
    const b = Math.floor(Math.random() * (max_factor_b + 1));

    return {
      question_text: `${a} × ${b} = ?`,
      answer: String(a * b),
    };
  },

  validate(question, answer) {
    return answer.trim() === question.answer;
  },

  component: NumericInput,
};
