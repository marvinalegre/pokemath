import type { Route } from "./+types/catch-page";
import { redirect } from "react-router";
import NumericInput from "~/components/NumericInput";
import { getAuthUser } from "~/lib/auth.server";
import { loadActiveQuestion, submitAnswer } from "~/engine/question";

async function getProfile(request: Request, env: Env) {
  // 1. Auth check
  const user = await getAuthUser(request, env);
  if (!user) throw redirect("/");

  // 2. Data fetching
  const profile = await env.DB.prepare(
    "SELECT id, rating FROM users WHERE username = ?",
  )
    .bind(user.username)
    .first<{ id: number; rating: number }>();

  if (!profile) {
    // A 404 is usually better for "Not Found" than a generic Error
    throw new Response("User Profile Not Found", { status: 404 });
  }
  return profile;
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const { DB } = context.cloudflare.env;

  const profile = await getProfile(request, context.cloudflare.env);

  const { question_text } = await loadActiveQuestion(
    profile.id,
    profile.rating,
    DB,
  );

  return { question_text };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { DB } = context.cloudflare.env;
  const formData = await request.formData();
  const answer = formData.get("answer");
  if (typeof answer !== "string") throw redirect("/catch");

  const profile = await getProfile(request, context.cloudflare.env);

  const { correct } = await submitAnswer(
    profile.id,
    profile.rating,
    answer,
    DB,
  );
  if (correct) return redirect("/catch");
  else return { message: "Wrong answer" };
}

export default function CatchPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  // Destructure for cleaner JSX
  const question = loaderData;

  return (
    <main className="container mx-auto py-8 px-4">
      <NumericInput
        question={question}
        key={question.question_text}
        message={actionData?.message}
      />
    </main>
  );
}
