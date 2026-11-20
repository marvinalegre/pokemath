"use server";

import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/session";
import { getActiveProblems, getCaughtPokemon, getUsers } from "@/lib/mongodb";
import { rollTier } from "@/lib/drop-rates";
import { pickPokemonOfTier } from "@/lib/pokemon";
import { gradeOf } from "@/lib/problem-grade-levels";
import type { CatchState } from "./types";
import { LOCK_MS } from "@/lib/constants";
import { recordAttempt } from "@/lib/ratings";

export async function checkAnswer(
  _prevState: CatchState,
  formData: FormData,
): Promise<CatchState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userId = new ObjectId(user.id);
  const activeProblems = await getActiveProblems();
  const active = await activeProblems.findOne({ userId });

  // Already solved in another tab, or waiting on the catch dialog.
  if (!active || active.pendingCatch) redirect("/catch");

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

  const correct = guess === Number(active.answer);
  await recordAttempt(userId, active.problemId, correct);

  if (correct) {
    const grade = gradeOf(active.problemId);
    const tier = rollTier(grade);
    const pokemonId = tier === 0 ? null : pickPokemonOfTier(tier).id;

    await activeProblems.updateOne(
      { userId },
      { $set: { pendingCatch: { pokemonId } } },
    );
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

export async function resolveCatch(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userId = new ObjectId(user.id);
  const activeProblems = await getActiveProblems();
  const active = await activeProblems.findOne({ userId });

  if (!active?.pendingCatch) redirect("/catch");

  const { pokemonId } = active.pendingCatch;
  const intent = String(formData.get("intent") ?? "");

  const claim = await activeProblems.deleteOne({
    userId,
    pendingCatch: { $exists: true },
  });

  if (claim.deletedCount === 1 && pokemonId !== null && intent === "keep") {
    const caught = await getCaughtPokemon();

    const first = await caught.findOne(
      { userId },
      { sort: { position: 1 }, projection: { position: 1 } },
    );
    const position = (first?.position ?? 0) - 1;

    await caught.insertOne({
      userId,
      pokemonId,
      caughtAt: new Date(),
      position,
    });
  }

  redirect("/catch");
}

export async function dismissCatchIntro() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const users = await getUsers();
  await users.updateOne(
    { _id: new ObjectId(user.id) },
    { $set: { dismissedCatchIntro: true } },
  );

  redirect("/catch");
}
