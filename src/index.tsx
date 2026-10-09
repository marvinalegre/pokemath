import { Hono } from "hono";

import { Nav } from "@/components/nav";
import { Layout } from "@/components/layout";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", (c) => {
  return c.html(
    <Layout>
      <Nav />
    </Layout>,
  );
});

export default app;
