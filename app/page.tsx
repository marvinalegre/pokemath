import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { logout } from "@/app/logout/actions";
import Pokeball from "./components/Pokeball";
import styles from "./page.module.css";

export const instant = false;

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <main>
        <section className={styles.hero}>
          <h1>Welcome back, {user.username}.</h1>
          <p>Wild Pokémon are waiting. Head out and see what you can catch.</p>

          <div className={styles.actions}>
            <Link href="/catch" className="button">
              Go catch Pokémon
            </Link>
          </div>

          <div className={styles.divider} />

          <p className={styles.logoutPrompt}>
            Done playing? Don&apos;t forget to log out.
          </p>

          <div className={styles.actions}>
            <form action={logout}>
              <button type="submit" className={styles.secondary}>
                Log out
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className={styles.hero}>
        <h1>
          Welcome to Pokum
          <Pokeball />
          n.
        </h1>
        <p>Log in to continue, or create an account to get started.</p>

        <div className={styles.actions}>
          <Link href="/login" className="button">
            Log in
          </Link>
          <Link href="/signup" className={styles.secondary}>
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
