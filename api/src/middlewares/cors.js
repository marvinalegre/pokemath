import { cors } from "hono/cors";

export default async function (c, next) {
  const corsMiddleware = cors({
    origin: c.env.FE_SERVER,
    credentials: true,
  });

  await corsMiddleware(c, next);
}
