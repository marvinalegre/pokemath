import jwt from "jsonwebtoken";
import db from "../database/db.js";

const home = (req, res) => {
  if (!req.cookies.token) {
    res.render("home", { username: undefined });
    return;
  }

  let decoded;
  try {
    decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  } catch (e) {
    res.render("home", { username: undefined });
    return;
  }

  const result = db
    .prepare("select * from users where jwt_sub = ?")
    .bind(decoded.sub)
    .all();
  res.render("home", { username: result[0].username });
};

export default { home };
