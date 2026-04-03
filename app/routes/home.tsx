import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export async function loader({ context }: Route.LoaderArgs) {
  return {
    message: `env: ${import.meta.env.VITE_TEST_VAR}`,
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
