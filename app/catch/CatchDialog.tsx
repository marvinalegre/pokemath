"use client";

import { useEffect, useRef } from "react";
import { resolveCatch } from "./actions";
import styles from "./catch.module.css";

type Props = {
  name: string;
  sprite: string;
  escaped: boolean;
};

export default function CatchDialog({ name, sprite, escaped }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="catch-dialog-title"
      // Block Escape so the player has to make a choice.
      onCancel={(e) => e.preventDefault()}
    >
      <div className={styles.dialogBody}>
        <img
          src={sprite}
          alt={escaped ? "" : name}
          width={128}
          height={128}
          className={escaped ? styles.spriteEscaped : styles.sprite}
        />

        {escaped ? (
          <>
            <h2 id="catch-dialog-title">It ran away!</h2>
            <p>{name} escaped before you could catch it.</p>
            <form action={resolveCatch}>
              <button type="submit" className={styles.submit}>
                Continue catching
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 id="catch-dialog-title">You caught {name}!</h2>
            <p>Keep it in your collection, or let it go.</p>
            <form action={resolveCatch} className={styles.dialogActions}>
              <button
                type="submit"
                name="intent"
                value="keep"
                className={styles.submit}
              >
                Keep
              </button>
              <button
                type="submit"
                name="intent"
                value="release"
                className={styles.secondary}
              >
                Release
              </button>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
