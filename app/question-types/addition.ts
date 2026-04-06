import type { QuestionType } from "./registry";
import NumericInput from "~/components/NumericInput";

interface AdditionParams {
  max_addend?: number; // largest value each addend can be
  min_addend?: number; // smallest value (default 0)
  num_addends?: number; // how many numbers to add (default 2)
}

export const addition: QuestionType = {
  id: "addition",

  generate(params: unknown) {
    const {
      max_addend = 10,
      min_addend = 0,
      num_addends = 2,
    } = (params as AdditionParams) ?? {};

    const addends = Array.from(
      { length: num_addends },
      () =>
        Math.floor(Math.random() * (max_addend - min_addend + 1)) + min_addend,
    );

    const answer = addends.reduce((sum, n) => sum + n, 0);
    const question_text = addends.join(" + ") + " = ?";

    return { question_text, answer: String(answer) };
  },

  validate(question, answer) {
    return answer.trim() === question.answer;
  },

  component: NumericInput,
};
