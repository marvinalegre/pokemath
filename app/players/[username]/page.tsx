import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getCaughtPokemon, getUsers } from "@/lib/mongodb";
import { pokemonTiers, spriteSrc } from "@/lib/pokemon";
import Link from "next/link";
import styles from "./player.module.css";

export const instant = false;

export const metadata = {
  title: "Player collection",
};

export default async function PlayerCollectionPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  const { username } = await params;

  const users = await getUsers();
  const player = await users.findOne(
    { username: username.toLowerCase() },
    { projection: { username: 1 } },
  );
  if (!player) notFound();

  // Your own collection has the editable view.
  if (player._id.toString() === me.id) redirect("/collection");

  const caught = await getCaughtPokemon();
  const docs = await caught
    .find({ userId: player._id })
    .sort({ position: 1, caughtAt: 1 })
    .toArray();

  const items = docs.flatMap((doc) => {
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
        <Link href="/players" className={styles.back}>
          ← All players
        </Link>
        <h1>{player.username}&apos;s Collection</h1>
        <p>
          {items.length} {items.length === 1 ? "Pokémon" : "Pokémon"} caught
        </p>

        {items.length === 0 ? (
          <p className={styles.empty}>No Pokémon caught yet.</p>
        ) : (
          <ul className={styles.grid}>
            {items.map((item) => (
              <li key={item.id} className={styles.card}>
                <img
                  src={item.sprite}
                  alt={item.name}
                  title={item.name}
                  width={96}
                  height={96}
                  className={styles.sprite}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
