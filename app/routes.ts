import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  route("catch", "routes/catch.tsx"),
  route("players", "routes/players.tsx"),
  route(":username", "routes/user.tsx"),
] satisfies RouteConfig;
