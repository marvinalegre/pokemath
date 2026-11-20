"use server";

import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/session";
import { getActiveProblems } from "@/lib/mongodb";
import type { CatchState } from "./types";
import { LOCK_MS } from "@/lib/constants";

export async function checkAnswer(
  _prevState: CatchState,
  formData: FormData,
): Promise<CatchState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userId = new ObjectId(user.id);
  const activeProblems = await getActiveProblems();
  const active = await activeProblems.findOne({ userId });

  // No active problem means it was already solved (e.g. a second tab).
  if (!active) redirect("/catch");

  // Enforce the lock on the server. The client countdown is display only.
  const now = Date.now();
  const lockedUntil = active.lockedUntil?.getTime() ?? 0;
  if (lockedUntil > now) {
    return { error: "Wait before trying again.", lockedUntil };
  }

  const raw = String(formData.get("answer") ?? "").trim();
  if (raw === "") {
    return { error: "Enter an answer.", lockedUntil: null };
  }

  const guess = Number(raw);

  if (guess === Number(active.answer)) {
    await activeProblems.deleteOne({ userId });
    // redirect() throws internally, so keep it outside any try/catch.
    redirect("/catch");
  }

  const newLockedUntil = now + LOCK_MS;
  await activeProblems.updateOne(
    { userId },
    { $set: { lockedUntil: new Date(newLockedUntil) } },
  );

  return {
    error: `Not quite. Try again in ${LOCK_MS / 1_000} seconds.`,
    lockedUntil: newLockedUntil,
  };
}
