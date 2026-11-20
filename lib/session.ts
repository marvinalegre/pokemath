import "server-only";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";
import { env } from "./env";

export type SessionData = {
  userId?: string;
  username?: string;
};

export const sessionOptions: SessionOptions = {
  password: env.SESSION_PASSWORD,
  cookieName: "pokumon_session",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession() {
  // Opt this read into request-time rendering before iron-session
  // checks expiry with Date.now().
  await connection();
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session.userId || !session.username) return null;
  return { id: session.userId, username: session.username };
}
