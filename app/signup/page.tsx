"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import styles from "./signup.module.css";

type Values = {
  username: string;
  password: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const initial: Values = {
  username: "",
  password: "",
};

function validate(values: Values): Errors {
  const errors: Errors = {};

  if (values.username.trim().length < 3) {
    errors.username = "Use at least 3 characters.";
  } else if (!/^[a-zA-Z0-9_]+$/.test(values.username.trim())) {
    errors.username = "Use only letters, numbers, and underscores.";
  }

  if (values.password.length < 8) {
    errors.password = "Use at least 8 characters.";
  }

  return errors;
}

export default function SignupPage() {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    // Replace with a real request, e.g. fetch("/api/signup", { method: "POST", ... })
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className={styles.wrapper}>
        <section className={styles.card}>
          <div className={styles.header}>
            <h1>Account created</h1>
            <p>Welcome, {values.username.trim()}.</p>
          </div>
          <Link href="/" className="button">
            Back to home
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.card}>
        <div className={styles.header}>
          <h1>Create an account</h1>
          <p>Choose a username and password.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={values.username}
              onChange={(e) => update("username", e.target.value)}
              className={errors.username ? styles.invalid : undefined}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
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
              value={values.password}
              onChange={(e) => update("password", e.target.value)}
              className={errors.password ? styles.invalid : undefined}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : "password-hint"
              }
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
            />
            <span>Show password</span>
          </label>

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </section>
    </div>
  );
}
