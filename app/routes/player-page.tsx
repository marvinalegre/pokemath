import { useState, useEffect } from "react";
import { redirect, useFetcher } from "react-router";
import { getAuthUser } from "~/lib/auth.server";
import { SortablePokemon } from "~/components/sortable-pokemon";
import type { Route } from "./+types/player-page";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { DB } = context.cloudflare.env;
  const user = await getAuthUser(request, context.cloudflare.env);
  if (!user) throw redirect("/login");

  const profile = await DB.prepare("SELECT id FROM users WHERE username = ?")
    .bind(user.username)
    .first<{ id: number }>();

  if (!profile) throw redirect("/");

  const collection = await DB.prepare(
    `
    SELECT 
      cp.id, 
      cp.pokemon_id, 
      cp.box_position,
      p.name, 
      p.color,
      p.availability
    FROM captured_pokemons cp
    JOIN pokemons p ON cp.pokemon_id = p.id
    WHERE cp.user_id = ?
    ORDER BY cp.box_position ASC, cp.captured_at DESC
  `,
  )
    .bind(profile.id)
    .all();

  return {
    collection: collection.results as any[],
    userId: profile.id,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { DB } = context.cloudflare.env;
  const user = await getAuthUser(request, context.cloudflare.env);
  if (!user) return { success: false };

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "reorder") {
    const newOrder = JSON.parse(formData.get("newOrder") as string);

    // Batch update box positions for efficiency
    const statements = newOrder.map((id: number, index: number) =>
      DB.prepare(
        "UPDATE captured_pokemons SET box_position = ? WHERE id = ?",
      ).bind(index, id),
    );

    await DB.batch(statements);
    return { success: true };
  }

  if (intent === "release") {
    const id = formData.get("id");
    await DB.prepare("DELETE FROM captured_pokemons WHERE id = ?")
      .bind(id)
      .run();
    return { success: true };
  }

  return { success: false };
}

export default function PlayerPage({ loaderData }: Route.ComponentProps) {
  const [items, setItems] = useState(loaderData.collection);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fetcher = useFetcher();

  useEffect(() => {
    setItems(loaderData.collection);
  }, [loaderData.collection]);

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const itemToMove = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, itemToMove);

    setDraggedIndex(index);
    setItems(newItems);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    fetcher.submit(
      { intent: "reorder", newOrder: JSON.stringify(items.map((p) => p.id)) },
      { method: "post" },
    );
  };

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground font-medium italic">
            This player has no pokemon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {items.map((pokemon, index) => (
            <SortablePokemon
              key={pokemon.id}
              pokemon={pokemon}
              index={index}
              isDragged={draggedIndex === index}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      )}
    </div>
  );
}
