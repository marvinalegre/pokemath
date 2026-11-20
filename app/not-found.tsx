import Link from "next/link";
import styles from "./errors.module.css";

export default function NotFound() {
  return (
    <main className={styles.wrapper}>
      <section className={styles.card}>
        <p className={styles.code}>404</p>
        <h1>Page not found</h1>
        <p>This Pokémon must have wandered off.</p>
        <Link href="/" className="button">
          Back to home
        </Link>
      </section>
    </main>
  );
}
