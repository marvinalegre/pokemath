"use server";

import bcrypt from "bcryptjs";
import type { LoginState } from "./types";
import { getUsers } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

// Invalid credentials get the same message whether the username or the
// password is wrong, so the response doesn't reveal which accounts exist.
const INVALID_MESSAGE = "Incorrect username or password.";

export async function login(
  _prevState: LoginState,
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

  const users = await getUsers();
  const user = await users.findOne({ username: username.toLowerCase() });

  // Always run bcrypt, even when the user doesn't exist, so response
  // timing doesn't reveal whether a username is registered.
  const hashToCompare =
    user?.passwordHash ??
    "$2b$12$CwTycUXWue0Thq9StjUM0uJ8.G2Yc6zq2a4fVb4d1CkqUoG3c1aVe";

  const passwordMatches = await bcrypt.compare(password, hashToCompare);

  if (!user || !passwordMatches) {
    return {
      status: "error",
      fieldErrors: {},
      formError: INVALID_MESSAGE,
      username,
    };
  }

  const session = await getSession();
  session.userId = user._id.toString();
  session.username = user.username;
  await session.save();

  redirect("/");
}
