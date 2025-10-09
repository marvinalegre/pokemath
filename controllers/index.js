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
    .prepare(
      `
WITH unique_user_pokemons AS (
    SELECT DISTINCT user_id, pokemon_id
    FROM user_pokemons
),
type_counts AS (
    SELECT
        uup.user_id,
        pt.type_id,
        COUNT(*) AS type_count
    FROM unique_user_pokemons uup
    JOIN pokemon_types pt ON uup.pokemon_id = pt.pokemon_id
    GROUP BY uup.user_id, pt.type_id
),
ranked_types AS (
    SELECT
        user_id,
        type_id,
        type_count,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY type_count DESC) AS rank
    FROM type_counts
),
top_types AS (
    SELECT
        user_id,
        MAX(CASE WHEN rank = 1 THEN type_id END) AS type1_id,
        MAX(CASE WHEN rank = 2 THEN type_id END) AS type2_id
    FROM ranked_types
    GROUP BY user_id
)
SELECT
    u.id AS user_id,
    u.username,
    t1.name AS top_type_1,
    t2.name AS top_type_2
FROM users u
LEFT JOIN top_types tt ON u.id = tt.user_id
LEFT JOIN types t1 ON tt.type1_id = t1.id
LEFT JOIN types t2 ON tt.type2_id = t2.id
ORDER BY u.id;
`,
    )
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
