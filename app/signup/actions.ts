"use server";

import bcrypt from "bcryptjs";
import type { SignupState } from "./types";
import { getUsers } from "@/lib/mongodb";
import { redirect } from "next/navigation";
import { DEFAULT_RATING } from "@/lib/constants";

export async function signup(
  _prevState: SignupState,
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

  const normalized = username.toLowerCase();
  const users = await getUsers();

  // Fast check for a friendly message. The unique index below is the real guarantee.
  const existing = await users.findOne({ username: normalized });
  if (existing) {
    return {
      status: "error",
      errors: { username: "That username is taken." },
      username,
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await users.insertOne({
      username: normalized,
      passwordHash,
      rating: DEFAULT_RATING,
      createdAt: new Date(),
    });
  } catch (err) {
    // 11000 is MongoDB's duplicate key error. Two signups can pass the
    // findOne check at the same time, so the index catches the race.
    if ((err as { code?: number }).code === 11000) {
      return {
        status: "error",
        errors: { username: "That username is taken." },
        username,
      };
    }
    throw err;
  }

  redirect("/login");
}
