import { PlayersList } from "@/components/players-list";

export const dynamic = "force-dynamic";

export default async function Page() {
  const res = await fetch("http://pokemath-api:3000/players");
  const players = await res.json();

  return (
    <main className="container mx-auto py-8">
      <PlayersList players={players} />
    </main>
  );
}
