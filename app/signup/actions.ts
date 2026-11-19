"use server";

import type { SignupState } from "./types";

export async function signup(
  prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const errors: SignupState["errors"] = {};

  if (username.length < 3) {
    errors.username = "Use at least 3 characters.";
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username = "Use only letters, numbers, and underscores.";
  }

  if (password.length < 8) {
    errors.password = "Use at least 8 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, username };
  }

  // TODO: check the username isn't taken, hash the password
  // (e.g. bcrypt or argon2), and insert the user into your database.
  // Never store the plain password.
  await new Promise((resolve) => setTimeout(resolve, 800));

  return { status: "success", errors: {}, username };
}
