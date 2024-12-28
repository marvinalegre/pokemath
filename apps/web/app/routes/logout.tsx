import { redirect } from "react-router";
import type { Route } from "./+types/logout";

export function meta({}: Route.MetaArgs) {
  return [{ title: "PokéMath | Logout" }];
}

export const clientLoader = async () => {
  const res = await fetch("/api/logout");
  const { success } = await res.json();

  if (success) {
    return redirect("/login");
  }

  // TODO: properly handle failed logout
  return null;
};

export default function Logout() {
  return <p>Logging out...</p>;
}
