import { Hono } from "hono";

import { Nav } from "@/components/nav";
import { Layout } from "@/components/layout";
import { SignupForm } from "@/components/signup-form";

export const signup = new Hono<{ Bindings: CloudflareBindings }>();

signup.get("/signup", (c) => {
  return c.html(
    <Layout>
      <Nav />
      <main class="container">
        <SignupForm />
      </main>
    </Layout>,
  );
});
