import express from "express";
const router = express.Router();
import controller from "../controllers/index.js";
import { limiter, ensureLoggedIn } from "../middlewares.js";

router.get("/", limiter(400), controller.home);
router.get("/catch", limiter(400), ensureLoggedIn, controller.catchForm);
router.post("/catch", limiter(400), ensureLoggedIn, controller.catchHandler);
router.get("/players", limiter(400), controller.players);
router.get("/:username", limiter(400), controller.player);

export default router;
