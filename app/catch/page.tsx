import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import katex from "katex";
import { getCurrentUser } from "@/lib/session";
import { getActiveProblems } from "@/lib/mongodb";
import { forge, type Problem } from "mathforge";
import AnswerForm from "./AnswerForm";
import styles from "./catch.module.css";

export const instant = false;

export const metadata = {
  title: "Catch",
};

const PROBLEM_ID = "addition-single-digit-no-carry" as const;

async function getOrCreateActiveProblem(userId: ObjectId): Promise<Problem> {
  const activeProblems = await getActiveProblems();

  const existing = await activeProblems.findOne({ userId });
  if (existing) {
    return {
      id: existing.problemId,
      data: existing.data,
      answer: existing.answer,
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
    return { id: PROBLEM_ID, data, answer };
  } catch (err) {
    if ((err as { code?: number }).code !== 11000) throw err;

    const winner = await activeProblems.findOne({ userId });
    if (!winner) throw err;
    return {
      id: winner.problemId,
      data: winner.data,
      answer: winner.answer,
    };
  }
}

export default async function CatchPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const active = await getOrCreateActiveProblem(new ObjectId(user.id));

  const problemHtml = katex.renderToString(
    `${active.data.a} + ${active.data.b} = \\; ?`,
    {
      throwOnError: false,
      displayMode: true,
    },
  );

  return (
    <main>
      <section className={styles.card}>
        <h1>Catch a Pokémon</h1>
        <p>Solve the problem to catch it.</p>

        {/* KaTeX output comes from our own forge(), not user input. */}
        <div
          className={styles.problem}
          dangerouslySetInnerHTML={{ __html: problemHtml }}
        />

        <AnswerForm />
      </section>
    </main>
  );
}
