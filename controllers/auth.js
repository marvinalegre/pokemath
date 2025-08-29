import { validateUsername, validatePassword } from "../utils/validation.js";
import { reservedUsernames } from "../utils/reservedUsernames.js";
import zxcvbn from "zxcvbn";
import bcrypt from "bcryptjs";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
);
import jwt from "jsonwebtoken";
import db from "../database/db.js";

const signupForm = (_req, res) => {
  res.render("signup", {
    username: undefined,
    usernameError: undefined,
    password: undefined,
    passwordError: undefined,
    generalError: undefined,
  });
};

const signup = async (req, res) => {
  let { username } = req.body;
  username = username.toLowerCase();
  const { password } = req.body;

  try {
    validateUsername(username);
  } catch (e) {
    return res.render("signup", {
      username,
      usernameError: e.message,
      password,
      passwordError: undefined,
      generalError: undefined,
    });
  }

  if (reservedUsernames.includes(username)) {
    return res.render("signup", {
      username,
      usernameError: "This username is not available.",
      password,
      passwordError: undefined,
      generalError: undefined,
    });
  }

  const result = db
    .prepare("select username from users where username = ?")
    .bind(username)
    .all();
  if (result.length) {
    return res.render("signup", {
      username,
      usernameError: "This username is not available.",
      password,
      passwordError: undefined,
      generalError: undefined,
    });
  }

  try {
    validatePassword(password);
  } catch (e) {
    return res.render("signup", {
      username,
      usernameError: undefined,
      password,
      passwordError: e.message,
      generalError: undefined,
    });
  }

  const zxcvbnOutput = zxcvbn(password);
  if (zxcvbnOutput.score < 3) {
    let err = "The password is weak.";
    if (zxcvbnOutput.feedback.warning) {
      err = `${err} ${zxcvbnOutput.feedback.warning}.`;
    } else if (zxcvbnOutput.feedback.suggestions.length > 0) {
      err = `${err} ${zxcvbnOutput.feedback.suggestions[0]}`;
    }
    return res.render("signup", {
      username,
      usernameError: undefined,
      password,
      passwordError: err,
      generalError: undefined,
    });
  }

  const hash = await bcrypt.hash(password, 10);
  const jwtSub = nanoid();

  // TODO: handle collisions on jwt_id
  try {
    db.prepare(
      "insert into users (jwt_sub, username, hashed_password) values (?, ?, ?)",
    )
      .bind(jwtSub, username, hash)
      .run();
  } catch (e) {
    return res.render("signup", {
      username,
      usernameError: undefined,
      password,
      passwordError: undefined,
      generalError: "Oops. Something went wrong.",
    });
  }

  const token = jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, sub: jwtSub },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
    },
  );
  res.cookie("token", token, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.redirect("/");
};

const loginForm = (_req, res) => {
  res.render("login", {
    username: undefined,
    usernameError: undefined,
    password: undefined,
    passwordError: undefined,
    generalError: undefined,
  });
};

const login = async (req, res) => {
  let { username } = req.body;
  username = username.toLowerCase();
  const { password } = req.body;

  try {
    validateUsername(username);
  } catch (e) {
    return res.render("login", {
      username,
      usernameError: e.message,
      password,
      passwordError: undefined,
      generalError: undefined,
    });
  }

  const result = db
    .prepare(
      "select username, hashed_password, jwt_sub from users where username = ?",
    )
    .bind(username)
    .all();
  if (!result.length) {
    return res.render("login", {
      username,
      usernameError: undefined,
      password,
      passwordError: undefined,
      generalError: "Invalid username or password.",
    });
  }

  try {
    validatePassword(password);
  } catch (e) {
    return res.render("login", {
      username,
      usernameError: undefined,
      password,
      passwordError: e.message,
      generalError: undefined,
    });
  }

  if (!(await bcrypt.compare(password, result[0].hashed_password))) {
    return res.render("login", {
      username,
      usernameError: undefined,
      password,
      passwordError: undefined,
      generalError: "Invalid username or password.",
    });
  }

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      sub: result[0].jwt_sub,
    },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
    },
  );
  res.cookie("token", token, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.redirect("/");
};

const logout = (_req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};

export default { signupForm, signup, loginForm, login, logout };
