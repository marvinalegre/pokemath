import express from "express";
const router = express.Router();
import controller from "../controllers/catch.js";
import { limiter, ensureLoggedIn } from "../middlewares.js";

router.get("/latest", limiter(400), ensureLoggedIn, controller.latest);
router.post("/latest", limiter(400), ensureLoggedIn, controller.dealWithLatest);

export default router;
