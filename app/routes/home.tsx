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

import { Badge } from "~/components/ui/badge";
import { Construction } from "lucide-react";

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="flex flex-col items-center gap-6">
        {/* Larger, more prominent Badge */}
        <Badge
          variant="secondary"
          className="px-6 py-2 text-sm md:text-base font-bold uppercase tracking-widest shadow-sm"
        >
          <Construction className="mr-3 h-5 w-5 text-yellow-500" />
          Active Development
        </Badge>

        {/* Scaled up Heading and Text */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
            We're building something.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-[500px] leading-relaxed">
            Things might break—we're moving fast to ship the best experience
            possible.
          </p>
        </div>
      </div>
    </main>
  );
}
