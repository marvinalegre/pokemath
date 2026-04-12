import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Sparkles, Ghost } from "lucide-react";

import type { Route } from "./+types/catch-page";
import { useState, useEffect } from "react";
import { redirect, useRevalidator } from "react-router";
import NumericInput from "~/components/numeric-input";
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
  const [open, setOpen] = useState(false);

  // Open modal when catchData arrives
  useEffect(() => {
    if (actionData?.catchData) {
      setOpen(true);
    }
  }, [actionData]);

  const catchData = actionData?.catchData;

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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white overflow-hidden">
          {catchData?.fled ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="bg-slate-100 p-6 rounded-full mb-4">
                <Ghost className="w-12 h-12 text-slate-400" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl text-slate-700">
                  It got away...
                </DialogTitle>
                <DialogDescription>
                  The Pokémon was too fast this time. Keep solving to find
                  another!
                </DialogDescription>
              </DialogHeader>
            </div>
          ) : (
            <div className="relative">
              {/* Dynamic background glow based on Pokemon color */}
              <div
                className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: catchData?.color }}
              />

              <div className="flex flex-col items-center py-4 text-center">
                {catchData?.isNew && (
                  <Badge
                    variant="secondary"
                    className="mb-4 bg-yellow-100 text-yellow-700 hover:bg-yellow-100 animate-bounce"
                  >
                    <Sparkles className="w-3 h-3 mr-1" /> New
                  </Badge>
                )}

                <div className="relative mb-6 group">
                  <div className="w-40 h-40 p-2 rounded-full flex items-center justify-center">
                    {/* Placeholder for Pokemon Sprite */}
                    <img
                      src={`images/sprites/${catchData?.id}.avif`}
                      className="text-6xl group-hover:scale-110 transition-transform cursor-default"
                    />
                  </div>
                </div>

                <DialogHeader className="items-center">
                  <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic">
                    Gotcha!
                  </DialogTitle>
                  <DialogDescription className="text-lg font-bold text-slate-900 mt-1">
                    {catchData?.name}
                  </DialogDescription>
                  <p className="text-sm text-slate-500 max-w-[280px] mt-2 italic">
                    "{catchData?.description}"
                  </p>
                </DialogHeader>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              className="w-full h-12 text-lg font-bold"
              onClick={() => setOpen(false)}
            >
              Continue Catching
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
