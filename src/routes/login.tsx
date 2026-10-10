import { Hono } from "hono";

import { Nav } from "@/components/nav";
import { Layout } from "@/components/layout";
import { LoginForm } from "@/components/login-form";

export const login = new Hono<{ Bindings: CloudflareBindings }>();

login.get("/", (c) => {
  return c.html(
    <Layout>
      <Nav />

      <main class="container auth-page">
        <h1>Log in</h1>

        <LoginForm />

        <p>
          No account? <a href="/signup">Sign up</a>
        </p>
      </main>
    </Layout>,
  );
});
