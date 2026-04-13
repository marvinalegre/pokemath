import * as jose from "jose";
import * as cookie from "cookie";

export type AuthUser = {
  username: string;
  role: string;
};

export async function ensureUser(
  request: Request,
  env: Env,
): Promise<{
  username: string;
  role: string;
  headers?: Record<string, string>;
}> {
  const user = await getAuthUser(request, env);
  if (user) {
    return { username: user.username, role: user.role };
  }
  const { username, jwt } = await createNewUser(env);
  return {
    username,
    role: "guest",
    headers: { "Set-Cookie": buildAuthCookie(jwt) },
  };
}

export async function getAuthUser(
  request: Request,
  env: Env,
): Promise<AuthUser | null> {
  const cookies = cookie.parseCookie(request.headers.get("Cookie") || "");

  if (!cookies.token) return null;

  const secret = getSecret(env);

  try {
    const { payload } = await jose.jwtVerify(cookies.token, secret);

    const username = payload.sub;
    if (!username) return null;

    const {
      results: [user],
    } = await env.DB.prepare("select role from users where username = ?")
      .bind(username)
      .all();

    if (!user) return null;

    return { username, role: user.role as string };
  } catch {
    return null; // expired or tampered token
  }
}

export function buildAuthCookie(jwt: string): string {
  return `token=${jwt}; Path=/; HttpOnly; Max-Age=604800${
    import.meta.env.PROD ? "; Secure" : ""
  }`;
}

export async function createNewUser(env: Env) {
  const username = `user_${generateRandomString(5)}`;
  const alg = "HS256";

  const jwt = await new jose.SignJWT()
    .setProtectedHeader({ alg })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret(env));

  await env.DB.prepare("insert into users(username, rating) values(?, ?)")
    .bind(username, 1000)
    .run();

  return { username, jwt };
}

const encoder = new TextEncoder();
function getSecret(env: Env): Uint8Array {
  return encoder.encode(env.JWT_SECRET);
}

function generateRandomString(length: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}
