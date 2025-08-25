import express from "express";
import path from "path";

const PORT = process.env.PORT || 3000;

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.render("home");
});

app.listen(PORT, () => console.log(`Now listening at ${PORT}.`));
