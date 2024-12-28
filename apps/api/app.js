import { Hono } from "hono";
const app = new Hono();

app.use("*", (c, next) => {
  console.log(c.req.path); ///
  if (c.req.path.startsWith("/api")) {
    return next();
  }
  const reqUrl = new URL(c.req.raw.url); ///
  return c.env.ASSETS.fetch(new URL("/index.html", reqUrl.origin)); ///
});
app.get("/api/hono", (c) => c.text("Hono!"));

export default app;
