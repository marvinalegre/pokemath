import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import katex from "katex";
import { getCurrentUser } from "@/lib/session";
import { getActiveProblems, getUsers, type PendingCatch } from "@/lib/mongodb";
import { forge, type Problem } from "mathforge";
import { pokemonTiers, spriteSrc } from "@/lib/pokemon";
import AnswerForm from "./AnswerForm";
import CatchDialog from "./CatchDialog";
import { dismissCatchIntro } from "./actions";
import styles from "./catch.module.css";

export const instant = false;

export const metadata = {
  title: "Catch",
};

const PROBLEM_ID = "addition-single-digit-no-carry" as const;

type ActiveState = {
  problem: Problem;
  lockedUntil: number | null;
  pendingCatch: PendingCatch | null;
};

async function getOrCreateActiveProblem(
  userId: ObjectId,
): Promise<ActiveState> {
  const activeProblems = await getActiveProblems();

  const existing = await activeProblems.findOne({ userId });
  if (existing) {
    return {
      problem: {
        id: existing.problemId,
        data: existing.data,
        answer: existing.answer,
      },
      lockedUntil: existing.lockedUntil?.getTime() ?? null,
      pendingCatch: existing.pendingCatch ?? null,
    };
  }

  const { data, answer } = forge(PROBLEM_ID);

  try {
    await activeProblems.insertOne({
      userId,
      problemId: PROBLEM_ID,
      data,
      answer,
    });
    return {
      problem: { id: PROBLEM_ID, data, answer },
      lockedUntil: null,
      pendingCatch: null,
    };
  } catch (err) {
    if ((err as { code?: number }).code !== 11000) throw err;

    const winner = await activeProblems.findOne({ userId });
    if (!winner) throw err;
    return {
      problem: {
        id: winner.problemId,
        data: winner.data,
        answer: winner.answer,
      },
      lockedUntil: winner.lockedUntil?.getTime() ?? null,
      pendingCatch: winner.pendingCatch ?? null,
    };
  }
}

async function hasDismissedIntro(userId: ObjectId): Promise<boolean> {
  const users = await getUsers();
  const user = await users.findOne(
    { _id: userId },
    { projection: { dismissedCatchIntro: 1 } },
  );
  return user?.dismissedCatchIntro === true;
}

export default async function CatchPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userId = new ObjectId(user.id);
  const showIntro = !(await hasDismissedIntro(userId));

  const { problem, lockedUntil, pendingCatch } =
    await getOrCreateActiveProblem(userId);

  const activeLock =
    lockedUntil && lockedUntil > Date.now() ? lockedUntil : null;

  const pokemon =
    pendingCatch && pendingCatch.pokemonId !== null
      ? pokemonTiers.find((p) => p.id === pendingCatch.pokemonId)
      : undefined;

  const problemHtml = katex.renderToString(
    `${problem.data.a} + ${problem.data.b} = \\; ?`,
    {
      throwOnError: false,
      displayMode: true,
    },
  );

  return (
    <main>
      <section className={styles.card}>
        {showIntro ? (
          <div className={styles.intro}>
            <div>
              <h1>Catch a Pokémon</h1>
              <p>Solve the problem to catch it.</p>
            </div>
            <form action={dismissCatchIntro}>
              <button type="submit" className={styles.dismiss}>
                Don&apos;t show again
              </button>
            </form>
          </div>
        ) : (
          <h1 className={styles.srOnly}>Catch a Pokémon</h1>
        )}

        {/* KaTeX output comes from our own forge(), not user input. */}
        <div
          className={styles.problem}
          dangerouslySetInnerHTML={{ __html: problemHtml }}
        />

        <AnswerForm initialLockedUntil={activeLock} />

        {pendingCatch && (
          <CatchDialog
            pokemon={
              pokemon
                ? { name: pokemon.name, sprite: spriteSrc(pokemon.id) }
                : null
            }
          />
        )}
      </section>
    </main>
  );
}
