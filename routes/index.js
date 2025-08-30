import express from "express";
const router = express.Router();
import controller from "../controllers/index.js";
import { ensureLoggedIn } from "../middlewares.js";

router.get("/", controller.home);
router.get("/catch", ensureLoggedIn, controller.catchForm);
router.post("/catch", ensureLoggedIn, controller.catchHandler);

export default router;
