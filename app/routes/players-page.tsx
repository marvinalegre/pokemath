import type { Route } from "./+types/players-page";
import { PlayersList } from "~/components/players-list";
import { z } from "zod";

export const PlayerSchema = z.object({
  id: z.number(),
  username: z.string().min(3).max(39),
  createdAt: z.string(),
});
export type Player = z.infer<typeof PlayerSchema>;

export async function loader({ context }: Route.LoaderArgs) {
  const { results } = await context.cloudflare.env.DB.prepare(
    "select id, username, created_at as createdAt from users order by created_at desc",
  ).all();
  return {
    players: PlayerSchema.array().parse(results),
  };
}

export default function Players({ loaderData }: Route.ComponentProps) {
  const { players } = loaderData;
  return (
    <main className="container mx-auto py-8">
      <PlayersList players={players} />
    </main>
  );
}
