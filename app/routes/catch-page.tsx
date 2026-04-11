import type { Route } from "./+types/catch-page";
import { useState, useEffect } from "react";
import { redirect, useRevalidator } from "react-router";
import NumericInput from "~/components/NumericInput";
import { getAuthUser } from "~/lib/auth.server";
import { loadActiveQuestion, submitAnswer } from "~/engine/question";
import { attemptCapture } from "~/engine/capture";

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

  const active = await DB.prepare(
    `SELECT retry_after FROM active_questions WHERE user_id = ?`,
  )
    .bind(profile.id)
    .first<{ retry_after: string | null }>();

  const { question_text } = await loadActiveQuestion(
    profile.id,
    profile.rating,
    DB,
  );

  if (active?.retry_after && new Date(active.retry_after) > new Date()) {
    const msLeft = new Date(active.retry_after).getTime() - Date.now();
    return { question_text, cooldown: { msLeft } };
  }
  return { question_text, cooldown: null };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { DB } = context.cloudflare.env;
  const formData = await request.formData();
  const answer = formData.get("answer");
  if (typeof answer !== "string") throw redirect("/catch");

  const profile = await getProfile(request, context.cloudflare.env);

  const result = await submitAnswer(profile.id, profile.rating, answer, DB);
  if (result.correct) {
    const catchData = await attemptCapture(DB, profile.id, profile.rating);

    return {
      correct: true,
      // If catchData is null, it means it "Got Away"
      catchData: catchData || { fled: true },
    };
  } else {
    return {
      message: "Wrong answer",
      correct: false,
      cooldown: result.cooldown,
    };
  }
}

export default function CatchPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const question = loaderData;
  const { cooldown } = loaderData;
  const revalidator = useRevalidator();
  const [secondsLeft, setSecondsLeft] = useState(0);

  const startCountdown = (msLeft: number) => {
    setSecondsLeft(Math.ceil(msLeft / 1000));

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          revalidator.revalidate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  // After wrong answer
  useEffect(() => {
    if (actionData?.correct !== false || !actionData.cooldown) return;
    return startCountdown(actionData.cooldown.msLeft);
  }, [actionData]);

  // After page refresh
  useEffect(() => {
    if (!cooldown) return;
    return startCountdown(cooldown.msLeft);
  }, []);

  return (
    <main className="container mx-auto py-8 px-4">
      <NumericInput
        key={question.question_text}
        question={question}
        message={actionData?.message}
        secondsLeft={secondsLeft}
      />
    </main>
  );
}
