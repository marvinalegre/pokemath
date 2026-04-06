import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("catch", "routes/catch-page.tsx"),
  route("players", "routes/players-page.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
