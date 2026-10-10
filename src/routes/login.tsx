import { Hono } from "hono";

import { Nav } from "@/components/nav";
import { Layout } from "@/components/layout";
import { LoginForm } from "@/components/login-form";

export const login = new Hono<{ Bindings: CloudflareBindings }>();

login.get("/login", (c) => {
  return c.html(
    <Layout>
      <Nav />
      <main class="container">
        <LoginForm />
      </main>
    </Layout>,
  );
});
