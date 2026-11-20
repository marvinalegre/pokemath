"use client";

import { useActionState, useEffect, useState } from "react";
import { checkAnswer } from "./actions";
import type { CatchState } from "./types";
import styles from "./catch.module.css";

export default function AnswerForm({
  initialLockedUntil,
}: {
  initialLockedUntil: number | null;
}) {
  const initialState: CatchState = {
    error: null,
    lockedUntil: initialLockedUntil,
  };

  const [state, formAction, isPending] = useActionState(
    checkAnswer,
    initialState,
  );

  // Stays null until mounted, so the server and client render the same markup.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!state.lockedUntil) return;

    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [state.lockedUntil]);

  const locked =
    state.lockedUntil !== null && (now === null || now < state.lockedUntil);

  const secondsLeft =
    locked && now !== null && state.lockedUntil !== null
      ? Math.ceil((state.lockedUntil - now) / 1000)
      : null;

  let buttonLabel = "Submit";
  if (locked) {
    buttonLabel =
      secondsLeft !== null ? `Try again in ${secondsLeft}s` : "Wait...";
  } else if (isPending) {
    buttonLabel = "Checking...";
  }

  return (
    <form action={formAction} className={styles.form} noValidate>
      <div className={styles.field}>
        <label htmlFor="answer">Your answer</label>
        <input
          id="answer"
          name="answer"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          disabled={locked}
          className={state.error ? styles.invalid : undefined}
          aria-invalid={!!state.error}
          aria-describedby={state.error ? "answer-error" : undefined}
        />
        {state.error && (
          <p id="answer-error" role="alert" className={styles.error}>
            {state.error}
          </p>
        )}
      </div>

      <button
        type="submit"
        className={styles.submit}
        disabled={locked || isPending}
      >
        {buttonLabel}
      </button>
    </form>
  );
}
