import * as jose from "jose";
import { parse } from "cookie";

export const onRequest: PagesFunction = async (context) => {
  const COOKIE_NAME = "token";
  const cookie = parse(context.request.headers.get("Cookie") || "");
  if (cookie[COOKIE_NAME] == null) {
    return Response.json({ loggedIn: false });
  }

  const secret = new TextEncoder().encode(context.env.JWT_SECRET);
  let jwtId;
  try {
    const { payload } = await jose.jwtVerify(cookie[COOKIE_NAME], secret);
    jwtId = payload.jwtId;
  } catch (e) {
    // TODO: log these (observability)
    return Response.json({ loggedIn: false });
  }

  const { results: users } = await context.env.DB.prepare(
    "select username from users where jwt_id = ?"
  )
    .bind(jwtId)
    .all();

  if (users.length === 1) {
    return Response.json({ loggedIn: true, username: users[0].username });
  } else {
    return Response.json({ loggedIn: false });
  }
};
