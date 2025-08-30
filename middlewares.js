import jwt from "jsonwebtoken";
import db from "./database/db.js";

export const redirectIfAuthenticated = (req, res, next) => {
  if (req.cookies?.token) {
    try {
      jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      return res.redirect("/");
    } catch (e) {}
  }
  next();
};

export const ensureLoggedIn = (req, res, next) => {
  if (!req.cookies?.token) {
    return res.redirect("/login");
  }

  let decoded;
  try {
    decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  } catch (e) {
    return res.redirect("/login");
  }

  const result = db
    .prepare("select id, username from users where jwt_sub = ?")
    .bind(decoded.sub)
    .all();
  req.user = result[0];

  next();
};
