import express from "express";
const router = express.Router();
import controller from "../controllers/index.js";
import { limiter } from "../middlewares.js";

router.get("/", limiter(400), controller.home);
router.get("/players", limiter(400), controller.players);

export default router;
