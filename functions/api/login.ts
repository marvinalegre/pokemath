import bcrypt from "bcryptjs";
import * as jose from "jose";
import { validateUsername } from "../../app/utils/validateUser";

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
    "select username, hashed_password, jwt_id from users where username = ?"
  )
    .bind(username)
    .all();

  if (!users.length)
    return Response.json({ err: "Incorrect username or password." });

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

  if (!(await bcrypt.compare(password, users[0].hashed_password)))
    return Response.json({ err: "Incorrect username or password." });

  const secret = new TextEncoder().encode(context.env.JWT_SECRET);
  const token = await new jose.SignJWT({ jwtId: users[0].jwt_id })
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
