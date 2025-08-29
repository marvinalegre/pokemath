import express from "express";
const router = express.Router();
import controller from "../controllers/index.js";

router.get("/", controller.home);

export default router;
