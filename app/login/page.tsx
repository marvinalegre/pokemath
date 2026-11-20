"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import styles from "../signup/signup.module.css";
import { login } from "./actions";
import { initialLoginState } from "./types";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    login,
    initialLoginState,
  );
  const [showPassword, setShowPassword] = useState(false);

  const { fieldErrors, formError } = state;
  const credentialsInvalid = !!formError;

  return (
    <div className={styles.wrapper}>
      <section className={styles.card}>
        <div className={styles.header}>
          <h1>Log in</h1>
          <p>Enter your username and password.</p>
        </div>

        <form action={formAction} className={styles.form} noValidate>
          {formError && (
            <p role="alert" className={styles.formError}>
              {formError}
            </p>
          )}

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
              className={
                fieldErrors.username || credentialsInvalid
                  ? styles.invalid
                  : undefined
              }
              aria-invalid={!!fieldErrors.username || credentialsInvalid}
              aria-describedby={
                fieldErrors.username ? "username-error" : undefined
              }
              disabled={isPending}
            />
            {fieldErrors.username && (
              <p id="username-error" className={styles.error}>
                {fieldErrors.username}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className={
                fieldErrors.password || credentialsInvalid
                  ? styles.invalid
                  : undefined
              }
              aria-invalid={!!fieldErrors.password || credentialsInvalid}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              disabled={isPending}
            />
            {fieldErrors.password && (
              <p id="password-error" className={styles.error}>
                {fieldErrors.password}
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
            {isPending ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className={styles.footer}>
          No account? <Link href="/signup">Create one</Link>
        </p>
      </section>
    </div>
  );
}
