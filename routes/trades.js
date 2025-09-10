import express from "express";
const router = express.Router();
import controller from "../controllers/trades.js";
import { limiter, ensureLoggedIn } from "../middlewares.js";

router.get("/", limiter(400), ensureLoggedIn, controller.trades);
router.get("/:tradeId", limiter(400), ensureLoggedIn, controller.tradeDetails);
router.post("/:tradeId", limiter(400), ensureLoggedIn, controller.handleTrade);

export default router;
