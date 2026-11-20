import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import katex from "katex";
import { getCurrentUser } from "@/lib/session";
import { getActiveProblems, getUsers } from "@/lib/mongodb";
import { forge, type Problem } from "mathforge";
import AnswerForm from "./AnswerForm";
import { dismissCatchIntro } from "./actions";
import styles from "./catch.module.css";

export const instant = false;

export const metadata = {
  title: "Catch",
};

const PROBLEM_ID = "addition-single-digit-no-carry" as const;

async function getOrCreateActiveProblem(userId: ObjectId): Promise<{
  problem: Problem;
  lockedUntil: number | null;
}> {
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
    return { problem: { id: PROBLEM_ID, data, answer }, lockedUntil: null };
  } catch (err) {
    if ((err as { code?: number }).code !== 11000) throw err;

    // Another request created the problem first, so use that one.
    const winner = await activeProblems.findOne({ userId });
    if (!winner) throw err;
    return {
      problem: {
        id: winner.problemId,
        data: winner.data,
        answer: winner.answer,
      },
      lockedUntil: winner.lockedUntil?.getTime() ?? null,
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

  const { problem, lockedUntil } = await getOrCreateActiveProblem(userId);

  const activeLock =
    lockedUntil && lockedUntil > Date.now() ? lockedUntil : null;

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
          // Keep a heading for screen readers even when the intro is hidden.
          <h1 className={styles.srOnly}>Catch a Pokémon</h1>
        )}

        {/* KaTeX output comes from our own forge(), not user input. */}
        <div
          className={styles.problem}
          dangerouslySetInnerHTML={{ __html: problemHtml }}
        />

        <AnswerForm initialLockedUntil={activeLock} />
      </section>
    </main>
  );
}
