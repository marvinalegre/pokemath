import Link from "next/link";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/session";
import { getCaughtPokemon, getUsers } from "@/lib/mongodb";
import styles from "./players.module.css";

export const instant = false;

export const metadata = {
  title: "Players",
};

export default async function PlayersPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  const users = await getUsers();
  const players = await users
    .find(
      { _id: { $ne: new ObjectId(me.id) } },
      { projection: { username: 1 } },
    )
    .sort({ username: 1 })
    .limit(100)
    .toArray();

  // Count catches for all listed players in one query.
  const caught = await getCaughtPokemon();
  const counts = await caught
    .aggregate<{ _id: ObjectId; count: number }>([
      { $match: { userId: { $in: players.map((p) => p._id) } } },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
    ])
    .toArray();

  const countById = new Map(counts.map((c) => [c._id.toString(), c.count]));

  return (
    <main>
      <section className={styles.page}>
        <h1>Players</h1>
        <p>Visit another trainer&apos;s collection.</p>

        {players.length === 0 ? (
          <p className={styles.empty}>No other players yet.</p>
        ) : (
          <ul className={styles.list}>
            {players.map((player) => (
              <li key={player._id.toString()}>
                <Link
                  href={`/players/${player.username}`}
                  className={styles.row}
                >
                  <span className={styles.username}>{player.username}</span>
                  <span className={styles.count}>
                    {countById.get(player._id.toString()) ?? 0} caught
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
