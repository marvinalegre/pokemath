import { Hono } from "hono";

import { Nav } from "@/components/nav";
import { Layout } from "@/components/layout";
import { SignupForm } from "@/components/signup-form";
import { LoginForm } from "@/components/login-form";

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
      <Nav />
      <main class="container">
        <SignupForm />
      </main>
    </Layout>,
  );
});

app.get("/login", (c) => {
  return c.html(
    <Layout>
      <Nav />
      <main class="container">
        <LoginForm />
      </main>
    </Layout>,
  );
});

export default app;
