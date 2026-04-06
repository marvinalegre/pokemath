import type { Route } from "./+types/catch-page";
import { redirect } from "react-router";
import NumericInput from "~/components/NumericInput";
import { getAuthUser } from "~/lib/auth.server";
import { loadActiveQuestion } from "~/engine/question";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { DB } = context.cloudflare.env;

  // 1. Auth check
  const user = await getAuthUser(request, context.cloudflare.env);
  if (!user) throw redirect("/");

  // 2. Data fetching
  const userData = await DB.prepare(
    "SELECT id, rating FROM users WHERE username = ?",
  )
    .bind(user.username)
    .first<{ id: number; rating: number }>();

  if (!userData) {
    // A 404 is usually better for "Not Found" than a generic Error
    throw new Response("User Profile Not Found", { status: 404 });
  }

  // 3. Question Logic
  const { question_text } = await loadActiveQuestion(
    userData.id,
    userData.rating,
    DB,
  );

  return { question_text };
}

export default function Players({ loaderData }: Route.ComponentProps) {
  // Destructure for cleaner JSX
  const question = loaderData;

  return (
    <main className="container mx-auto py-8 px-4">
      <NumericInput
        question={question}
        onAnswer={(val) => console.log("Answered:", val)}
      />
    </main>
  );
}
