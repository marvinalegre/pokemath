import type { Route } from "./+types/catch-page";
import { getQuestionType } from "~/question-types/registry";
import { selectQuestionType } from "~/engine/selector";
import NumericInput from "~/components/NumericInput";

export async function loader({ context }: Route.LoaderArgs) {
  const selectedQuestionType = await selectQuestionType(
    1,
    500,
    context.cloudflare.env.DB,
  );
  const question = getQuestionType(selectedQuestionType.generator)?.generate(
    selectedQuestionType.generator_params,
  );
  return question;
}

export default function Players({ loaderData }: Route.ComponentProps) {
  return (
    <main className="container mx-auto py-8">
      <NumericInput question={loaderData} onAnswer={() => {}} />
    </main>
  );
}
