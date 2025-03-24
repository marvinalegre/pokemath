import { setCookie } from "hono/cookie";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  setCookie(c, "token", "", {
    path: "/",
    secure: true,
    httpOnly: true,
    expires: new Date(0),
    sameSite: "Strict",
  });

  return c.json({ success: true });
});

export default app;
