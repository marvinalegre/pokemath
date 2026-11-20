"use client";

import { useEffect } from "react";
import styles from "./errors.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.wrapper}>
      <section className={styles.card}>
        <p className={styles.code}>Error</p>
        <h1>Something went wrong</h1>
        <p>Try again, or come back in a moment.</p>
        <button type="button" className={styles.retry} onClick={reset}>
          Try again
        </button>
      </section>
    </main>
  );
}
