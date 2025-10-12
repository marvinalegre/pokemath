import express from "express";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import { bot, chatId } from "./telegram-bot.js";
import { verifyToken } from "./middlewares.js";
import indexRoutes from "./routes/index.js";
import authRoutes from "./routes/auth.js";
import catchRoutes from "./routes/catch.js";
import playerRoutes from "./routes/player.js";
import tradesRoutes from "./routes/trades.js";

const app = express();
const accessLogStream = fs.createWriteStream(
  path.join(process.cwd(), "logs", "access.log"),
  { flags: "a" },
);

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(verifyToken);
app.use(express.json());

app.use("/", authRoutes);
app.use("/catch", catchRoutes);
app.use("/trades", tradesRoutes);
app.use("/", indexRoutes);
app.use("/", playerRoutes);

app.use((_req, res) => {
  res.status(404).render("404");
});

app.use(async (err, _req, res, _next) => {
  await bot.telegram.sendMessage(chatId, err);
  res.status(500).render("500");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Now listening at ${PORT}.`));
