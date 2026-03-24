import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  return {
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
    users: (
      await context.cloudflare.env.DB.prepare("select * from users").all()
    ).results,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Welcome message={loaderData.message} />
      {loaderData.users.map((u) => (
        <li key={u.id}>{u.username}</li>
      ))}
    </>
  );
}
