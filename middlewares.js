import jwt from "jsonwebtoken";
import db from "./database/db.js";
import { rateLimit } from "express-rate-limit";

export const verifyToken = (req, res, next) => {
  if (!req.cookies?.token) {
    return next();
  }

  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    req.sub = decoded.sub;
  } catch (_) {}

  next();
};

export const redirectIfAuthenticated = (req, res, next) => {
  if (req.sub) {
    return res.redirect("/");
  }
  next();
};

export const ensureLoggedIn = (req, res, next) => {
  if (!req.sub) {
    return res.redirect("/login");
  }

  const result = db
    .prepare("select id, username from users where jwt_sub = ?")
    .bind(req.sub)
    .all();
  req.user = result[0];

  next();
};

export function limiter(limit) {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: limit,
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    // store: ... , // Redis, Memcached, etc. See below.
  });
}
