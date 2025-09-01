import express from "express";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import indexRoutes from "./routes/index.js";
import authRoutes from "./routes/auth.js";
import catchRoutes from "./routes/catch.js";

const app = express();
app.use(helmet());
const accessLogStream = fs.createWriteStream(
  path.join(process.cwd(), "logs", "access.log"),
  { flags: "a" },
);
app.use(morgan("combined", { stream: accessLogStream }));
app.use(compression());

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", authRoutes);
app.use("/catch", catchRoutes);
app.use("/", indexRoutes);

app.use((_req, res) => {
  res.status(404).send("Page not found");
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send("Internal server error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Now listening at ${PORT}.`));
