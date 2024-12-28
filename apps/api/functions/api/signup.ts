import zxcvbn from "zxcvbn";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { nanoid } from "nanoid";
import { validateUsername } from "../../app/utils/validateUsername";

export const onRequestPost: PagesFunction = async (context) => {
  const { username, password } = (await context.request.json()) as {
    username: string;
    password: string;
  };

  if (typeof username !== "string")
    return Response.json({ err: "Invalid username." });
  const validationResult = validateUsername(username);
  if (validationResult !== "Username is valid.")
    return Response.json({ err: validationResult });

  const { results: users } = await context.env.DB.prepare(
    "select username from users where username = ?"
  )
    .bind(username)
    .all();

  if (users.length)
    return Response.json({ err: "This username is not available." });

  // password validation
  if (typeof password !== "string")
    return Response.json({ err: "Invalid password." });
  if (password.length > 40)
    return Response.json({
      err: "The password must contain a maximum of 40 characters.",
    });
  if (password.length < 8)
    return Response.json({
      err: "The password must contain a minimum of 8 characters.",
    });
  if (
    zxcvbn(password).crack_times_display.online_throttling_100_per_hour !==
    "centuries"
  )
    return Response.json({
      err: "The password is too weak. Please choose a stronger password.",
    });

  const hash = await bcrypt.hash(password, 10);
  const jwtId = nanoid();

  // TODO: handle collisions on jwt_id
  try {
    await context.env.DB.prepare(
      "insert into users (jwt_id, username, hashed_password) values (?, ?, ?)"
    )
      .bind(jwtId, username, hash)
      .run();
  } catch (e) {
    return Response.json({ err: e.message });
  }

  const secret = new TextEncoder().encode(context.env.JWT_SECRET);
  const token = await new jose.SignJWT({ jwtId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("4w")
    .sign(secret);

  const response = new Response(JSON.stringify({ success: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `token=${token}; path=/; secure; HttpOnly; SameSite=Strict`,
    },
  });
  return response;
};
