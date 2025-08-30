import express from "express";
const router = express.Router();
import controller from "../controllers/catch.js";
import { ensureLoggedIn } from "../middlewares.js";

router.get("/latest", ensureLoggedIn, controller.latest);
router.post("/latest", ensureLoggedIn, controller.dealWithLatest);

export default router;
