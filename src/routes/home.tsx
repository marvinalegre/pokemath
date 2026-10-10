import { Hono } from "hono";

import { Nav } from "@/components/nav";
import { Layout } from "@/components/layout";

export const home = new Hono<{ Bindings: CloudflareBindings }>();

home.get("/", (c) => {
  return c.html(
    <Layout>
      <Nav />
    </Layout>,
  );
});
