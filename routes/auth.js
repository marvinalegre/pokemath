import express from "express";
const router = express.Router();
import controller from "../controllers/auth.js";
import { limiter, redirectIfAuthenticated } from "../middlewares.js";

router.get(
  "/signup",
  limiter(10),
  redirectIfAuthenticated,
  controller.signupForm,
);
router.post("/signup", limiter(10), controller.signup);
router.get(
  "/login",
  limiter(10),
  redirectIfAuthenticated,
  controller.loginForm,
);
router.post("/login", limiter(10), controller.login);
router.get("/logout", limiter(10), controller.logout);

export default router;
