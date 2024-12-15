import { parse } from "cookie";

interface Env {
  KV: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  // const COOKIE_NAME = "jwt_id";
  // const cookie = parse(context.request.headers.get("Cookie") || "");
  // if (cookie[COOKIE_NAME] != null) {
  //   // Respond with the cookie value
  //   return new Response(cookie[COOKIE_NAME]);
  // }
  return Response.json({ loggedIn: false });
};
