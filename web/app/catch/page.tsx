import { CatchClient } from "@/components/catch-client";
import { cookies } from "next/headers";

async function getQuestion() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const res = await fetch(
    `${process.env.INTERNAL_API_BASE_URL as string}/catch`,
    {
      headers: {
        Authorization: `Bearer ${token!.value}`,
      },
    },
  );
  const data = await res.json();
  return data.question;
}

export default async function CatchPage() {
  const question = await getQuestion();
  return <CatchClient question={question} />;
}
