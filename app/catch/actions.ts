"use server";

import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/session";
import { getActiveProblems } from "@/lib/mongodb";
import type { CatchState } from "./types";

export async function checkAnswer(
  _prevState: CatchState,
  formData: FormData,
): Promise<CatchState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const raw = String(formData.get("answer") ?? "").trim();
  if (raw === "") {
    return { error: "Enter an answer." };
  }

  const guess = Number(raw);

  const userId = new ObjectId(user.id);
  const activeProblems = await getActiveProblems();
  const active = await activeProblems.findOne({ userId });

  // No active problem means it was already solved (e.g. a second tab).
  if (!active) redirect("/catch");

  if (guess !== Number(active.answer)) {
    return { error: "Not quite. Try again." };
  }

  // Correct: remove the solved problem. The redirect loads a fresh one.
  await activeProblems.deleteOne({ userId });
  redirect("/catch");
}
