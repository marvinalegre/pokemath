import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  route("logout", "routes/logout.tsx"),
  route("catch", "routes/catch.tsx"),
  route("catch/latest", "routes/caught.tsx"),
  route("players", "routes/players.tsx"),
  route(":username", "routes/user.tsx"),
  route("evolve/:extId", "routes/evolve.tsx"),
] satisfies RouteConfig;
