import express from "express";
const router = express.Router();
import controller from "../controllers/auth.js";
import { redirectIfAuthenticated } from "../middlewares.js";

router.get("/signup", redirectIfAuthenticated, controller.signupForm);
router.post("/signup", controller.signup);
router.get("/login", redirectIfAuthenticated, controller.loginForm);
router.post("/login", controller.login);
router.get("/logout", controller.logout);

export default router;
