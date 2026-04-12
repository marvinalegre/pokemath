import type { QuestionType } from "~/question-types/registry";
import NumericInput from "~/components/numeric-input";

interface SubtractionParams {
  max_minuend?: number; // largest value the starting number can be
  min_result?: number; // floor for the answer (default 0, set negative to allow negative results)
}

export const subtraction: QuestionType = {
  id: "subtraction",

  generate(params: unknown) {
    const { max_minuend = 10, min_result = 0 } =
      (params as SubtractionParams) ?? {};

    const minuend = Math.floor(Math.random() * (max_minuend + 1));
    const maxSubtrahend = minuend - min_result;
    const subtrahend = Math.floor(Math.random() * (maxSubtrahend + 1));
    const answer = minuend - subtrahend;

    return {
      question_text: `${minuend} - ${subtrahend} = ?`,
      answer: String(answer),
    };
  },

  validate(question, answer) {
    return answer.trim() === question.answer;
  },

  component: NumericInput,
};
