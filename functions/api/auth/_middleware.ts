import { parse } from "cookie";
import * as jose from "jose";

export async function onRequest(context) {
  const cookie = parse(context.request.headers.get("Cookie") || "");
  if (cookie["token"] == null) {
    return new Response(null, {
      status: 401,
      statusText: "Unauthenticated",
    });
  }

  const secret = new TextEncoder().encode(context.env.JWT_SECRET);
  let jwtId;
  try {
    const { payload } = await jose.jwtVerify(cookie["token"], secret);
    jwtId = payload.jwtId;
  } catch (e) {
    // TODO: log these (observability)
    return new Response(null, {
      status: 401,
      statusText: "Unauthenticated",
    });
  }

  const { results: users } = await context.env.DB.prepare(
    "select id from users where jwt_id = ?"
  )
    .bind(jwtId)
    .all();

  context.data["userId"] = users[0].id;

  return context.next();
}
