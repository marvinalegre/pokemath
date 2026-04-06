import type { Route } from "./+types/catch-page";
import { getQuestionType } from "~/question-types/registry";
import { selectQuestionType } from "~/engine/selector";
import NumericInput from "~/components/NumericInput";
import { getAuthUser } from "~/lib/auth.server";
import { redirect } from "react-router";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context.cloudflare;

  const user = await getAuthUser(request, env);
  if (!user) throw redirect("/");

  const userData = await env.DB.prepare(
    "SELECT id, rating FROM users WHERE username = ?",
  )
    .bind(user.username)
    .first<{ id: number; rating: number }>();

  if (!userData) {
    throw new Error(`User profile for ${user.username} not found`);
  }

  const selectedType = await selectQuestionType(
    userData.id,
    userData.rating,
    env.DB,
  );

  const handler = getQuestionType(selectedType.generator);

  if (!handler) {
    throw new Error(`Unknown generator type: ${selectedType.generator}`);
  }

  return handler.generate(selectedType.generator_params);
}

export default function Players({ loaderData }: Route.ComponentProps) {
  return (
    <main className="container mx-auto py-8">
      <NumericInput question={loaderData} onAnswer={() => {}} />
    </main>
  );
}
