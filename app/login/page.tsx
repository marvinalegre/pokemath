"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import styles from "../signup/signup.module.css";

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

  if (!values.username.trim()) {
    errors.username = "Enter your username.";
  }

  if (!values.password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export default function LoginPage() {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setFormError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    // Replace with a real request, e.g. fetch("/api/login", { method: "POST", ... })
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);

    // Placeholder check; remove once the real request is wired up.
    if (values.password !== "password123") {
      setFormError("Incorrect username or password.");
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className={styles.wrapper}>
        <section className={styles.card}>
          <div className={styles.header}>
            <h1>Welcome back</h1>
            <p>Signed in as {values.username.trim()}.</p>
          </div>
          <Link href="/" className="button">
            Go to home
          </Link>
        </section>
      </div>
    );
  }

  const credentialsInvalid = !!formError;

  return (
    <div className={styles.wrapper}>
      <section className={styles.card}>
        <div className={styles.header}>
          <h1>Log in</h1>
          <p>Enter your username and password.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
              value={values.username}
              onChange={(e) => update("username", e.target.value)}
              className={
                errors.username || credentialsInvalid
                  ? styles.invalid
                  : undefined
              }
              aria-invalid={!!errors.username || credentialsInvalid}
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
              autoComplete="current-password"
              value={values.password}
              onChange={(e) => update("password", e.target.value)}
              className={
                errors.password || credentialsInvalid
                  ? styles.invalid
                  : undefined
              }
              aria-invalid={!!errors.password || credentialsInvalid}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className={styles.error}>
                {errors.password}
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
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className={styles.footer}>
          No account? <Link href="/signup">Create one</Link>
        </p>
      </section>
    </div>
  );
}
