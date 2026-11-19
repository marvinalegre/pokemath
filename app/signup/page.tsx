"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import styles from "./signup.module.css";
import { signup } from "./actions";
import { initialSignupState } from "./types";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(
    signup,
    initialSignupState,
  );
  const [showPassword, setShowPassword] = useState(false);

  if (state.status === "success") {
    return (
      <div className={styles.wrapper}>
        <section className={styles.card}>
          <div className={styles.header}>
            <h1>Account created</h1>
            <p>Welcome, {state.username}.</p>
          </div>
          <Link href="/" className="button">
            Back to home
          </Link>
        </section>
      </div>
    );
  }

  const { errors } = state;

  return (
    <div className={styles.wrapper}>
      <section className={styles.card}>
        <div className={styles.header}>
          <h1>Create an account</h1>
          <p>Choose a username and password.</p>
        </div>

        <form action={formAction} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              defaultValue={state.username}
              className={errors.username ? styles.invalid : undefined}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
              disabled={isPending}
            />
            {errors.username && (
              <p id="username-error" className={styles.error}>
                {errors.username}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className={errors.password ? styles.invalid : undefined}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : "password-hint"
              }
              disabled={isPending}
            />
            {errors.password ? (
              <p id="password-error" className={styles.error}>
                {errors.password}
              </p>
            ) : (
              <p id="password-hint" className={styles.hint}>
                At least 8 characters.
              </p>
            )}
          </div>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              disabled={isPending}
            />
            <span>Show password</span>
          </label>

          <button type="submit" className={styles.submit} disabled={isPending}>
            {isPending ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </section>
    </div>
  );
}
