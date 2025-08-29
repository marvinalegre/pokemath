import jwt from "jsonwebtoken";

export const redirectIfAuthenticated = (req, res, next) => {
  if (req.cookies?.token) {
    try {
      jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      return res.redirect("/");
    } catch (e) {}
  }
  next();
};
