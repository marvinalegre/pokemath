import db from "../database/db.js";

const home = (req, res) => {
  if (!req.sub) {
    return res.render("home", { username: undefined });
  }

  const { username } = getUser(req.sub);

  return res.render("home", { username });
};

const players = (req, res) => {
  const players = db
    .prepare("select username from users order by username asc")
    .all();

  if (!req.sub) {
    return res.render("players", {
      username: undefined,
      players,
    });
  }

  const { username } = getUser(req.sub);

  return res.render("players", { players, username });
};

export default {
  home,
  players,
};

function getUser(sub) {
  const users = db
    .prepare("select id, username from users where jwt_sub = ?")
    .bind(sub)
    .all();
  return users[0];
}
