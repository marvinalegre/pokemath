"use server";

import type { LoginState } from "./types";

export async function login(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const fieldErrors: LoginState["fieldErrors"] = {};

  if (!username) {
    fieldErrors.username = "Enter your username.";
  }

  if (!password) {
    fieldErrors.password = "Enter your password.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, username };
  }

  // TODO: look up the user, then compare the password against the stored
  // hash with bcrypt.compare or argon2.verify. Never compare plain text.
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Placeholder check; remove once the real lookup is in place.
  if (password !== "password123") {
    return {
      status: "error",
      fieldErrors: {},
      formError: "Incorrect username or password.",
      username,
    };
  }

  // TODO: create a session (cookie or token) here before returning.
  return { status: "success", fieldErrors: {}, username };
}
