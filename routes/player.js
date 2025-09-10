import express from "express";
const router = express.Router();
import controller from "../controllers/player.js";
import { limiter, ensureLoggedIn } from "../middlewares.js";

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
