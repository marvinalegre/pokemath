import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

import indexRoutes from "./routes/index.js";
import authRoutes from "./routes/auth.js";
import catchRoutes from "./routes/catch.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/catch", catchRoutes);

app.listen(PORT, () => console.log(`Now listening at ${PORT}.`));
