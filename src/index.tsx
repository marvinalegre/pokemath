import { Hono } from "hono";

import { Nav } from "@/components/nav";
import { Layout } from "@/components/layout";
import { SignupForm } from "@/components/signup-form";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", (c) => {
  return c.html(
    <Layout>
      <Nav />
    </Layout>,
  );
});

app.get("/signup", (c) => {
  return c.html(
    <Layout>
      <SignupForm />
    </Layout>,
  );
});

export default app;
