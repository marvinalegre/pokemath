import { Card, CardContent } from "~/components/ui/card";
import type { Player } from "~/routes/players-page";

function formatJoinDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

export function PlayersList({ players }: { players: Player[] }) {
  if (players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <span className="text-5xl">🎮</span>
        <p className="text-sm">No players have joined yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-8">
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium px-1">
        {players.length} Players
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {players.map((player) => (
          <Card
            key={player.id}
            className="group border border-zinc-200 shadow-none hover:border-zinc-400 hover:shadow-sm transition-all duration-200"
          >
            <CardContent className="pt-5 pb-4 px-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500 shrink-0 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-200">
                {getInitials(player.username)}
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-sm text-zinc-900 truncate leading-tight">
                  {player.username}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Joined {formatJoinDate(player.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
