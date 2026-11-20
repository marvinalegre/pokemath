"use client";

import { useActionState } from "react";
import { checkAnswer } from "./actions";
import { initialCatchState } from "./types";
import styles from "./catch.module.css";

export default function AnswerForm() {
  const [state, formAction, isPending] = useActionState(
    checkAnswer,
    initialCatchState,
  );

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

      <button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? "Checking..." : "Submit"}
      </button>
    </form>
  );
}
