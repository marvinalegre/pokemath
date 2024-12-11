import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "PokéMath" }];
}

export async function clientLoader() {
  const res = await fetch("/api/hw");
  const { message } = await res.json();

  return { message };
}

export default function Home() {
  const { message } = useLoaderData();

  return <p>{message}</p>;
}
