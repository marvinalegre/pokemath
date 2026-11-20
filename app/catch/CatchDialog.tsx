"use client";

import { useEffect, useRef } from "react";
import { resolveCatch } from "./actions";
import styles from "./catch.module.css";

type Props = {
  // null means the Pokémon escaped.
  pokemon: { name: string; sprite: string } | null;
};

export default function CatchDialog({ pokemon }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="catch-dialog-title"
      onCancel={(e) => e.preventDefault()}
    >
      <div className={styles.dialogBody}>
        {pokemon === null ? (
          <>
            <h2 id="catch-dialog-title">It ran away!</h2>
            <p>The wild Pokémon escaped before you could catch it.</p>
            <form action={resolveCatch}>
              <button type="submit" className={styles.submit}>
                Continue catching
              </button>
            </form>
          </>
        ) : (
          <>
            <img
              src={pokemon.sprite}
              alt=""
              width={128}
              height={128}
              className={styles.sprite}
            />
            <h2 id="catch-dialog-title">You caught {pokemon.name}!</h2>
            <p>Keep it in your collection, or let it go.</p>
            <div className={styles.dialogActions}>
              <form action={resolveCatch}>
                <input type="hidden" name="intent" value="keep" />
                <button type="submit" className={styles.submit}>
                  Keep
                </button>
              </form>

              <form action={resolveCatch}>
                <input type="hidden" name="intent" value="release" />
                <button type="submit" className={styles.secondary}>
                  Release
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
