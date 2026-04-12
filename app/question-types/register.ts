import { registerQuestionType } from "./registry";
import * as types from "./index";

export function registerAllQuestionTypes() {
  Object.values(types).forEach(registerQuestionType);
}
