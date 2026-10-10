import { Hono } from "hono";

import { home } from "@/routes/home";
import { signup } from "@/routes/signup";
import { login } from "@/routes/login";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.route("/", home);
app.route("/signup", signup);
app.route("/login", login);

export default app;
