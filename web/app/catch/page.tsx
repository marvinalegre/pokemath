import { CatchClient } from "@/components/catch-client";

async function getQuestion() {
  const res = await fetch("http://pokemath-api:3000/catch");
  const data = await res.json();
  return data.question;
}

export default async function CatchPage() {
  const question = await getQuestion();
  return <CatchClient question={question} />;
}
