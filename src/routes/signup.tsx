import { Hono } from "hono";

import { Nav } from "@/components/nav";
import { Layout } from "@/components/layout";
import { SignupForm } from "@/components/signup-form";

export const signup = new Hono<{ Bindings: CloudflareBindings }>();

signup.get("/", (c) => {
  return c.html(
    <Layout>
      <Nav />

      <main class="container auth-page">
        <h1>Create an account</h1>

        <SignupForm />

        <p>
          Have an account? <a href="/login">Log in</a>
        </p>
      </main>
    </Layout>,
  );
});
