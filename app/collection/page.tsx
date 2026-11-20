import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/session";
import { getCaughtPokemon } from "@/lib/mongodb";
import { pokemonTiers, spriteSrc } from "@/lib/pokemon";
import CollectionGrid from "./CollectionGrid";
import type { CaughtItem } from "./types";
import styles from "./collection.module.css";

export const instant = false;

export const metadata = {
  title: "Collection",
};

export default async function CollectionPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const caught = await getCaughtPokemon();
  const docs = await caught
    .find({ userId: new ObjectId(user.id) })
    .sort({ position: 1, caughtAt: 1 })
    .toArray();

  const items: CaughtItem[] = docs.flatMap((doc) => {
    const pokemon = pokemonTiers.find((p) => p.id === doc.pokemonId);
    if (!pokemon) return [];
    return [
      {
        id: doc._id.toString(),
        name: pokemon.name,
        sprite: spriteSrc(pokemon.id),
      },
    ];
  });

  return (
    <main>
      <section className={styles.page}>
        <h1>Your Collection</h1>
        <p>Drag to reorder. Select a Pokémon for options.</p>
        <CollectionGrid initialItems={items} />
      </section>
    </main>
  );
}
