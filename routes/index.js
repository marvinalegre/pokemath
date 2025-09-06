import express from "express";
const router = express.Router();
import controller from "../controllers/index.js";
import { limiter, ensureLoggedIn } from "../middlewares.js";

router.get("/", limiter(400), controller.home);
router.get("/catch", limiter(400), ensureLoggedIn, controller.catchForm);
router.post("/catch", limiter(400), ensureLoggedIn, controller.catchHandler);
router.get("/players", limiter(400), controller.players);
router.get("/trades", limiter(400), ensureLoggedIn, controller.trades);
router.get(
  "/trades/:tradeId",
  limiter(400),
  ensureLoggedIn,
  controller.tradeDetails,
);
router.post(
  "/trades/:tradeId",
  limiter(400),
  ensureLoggedIn,
  controller.handleTrade,
);
router.get("/:username", limiter(400), controller.player);
router.get("/:username/:pokemonId", limiter(400), controller.pokemon);
router.get("/:username/:pokemonId/card", limiter(400), controller.pokemonCard);
router.get(
  "/:username/:pokemonId/trade",
  limiter(400),
  ensureLoggedIn,
  controller.makeOffer,
);
router.post(
  "/:username/:pokemonId/trade",
  limiter(400),
  ensureLoggedIn,
  controller.handleOffer,
);

export default router;
