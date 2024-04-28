import { Hono } from "hono";
import contextEnabledCors from "./middlewares/cors.js";
import { getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

const app = new Hono();

const auth = async (c, next) => {
  const token = getCookie(c, "token");

  try {
    const decodedPayload = await verify(token, c.env.JWT_SECRET);
    await next();
  } catch (e) {
    return c.json({
      loggedIn: false,
    });
  }
};

app.use("*", contextEnabledCors);
app.use("/auth/*", auth);

app.get("/auth/test", (c) => {
  return c.text("asfd");
});

app.get("/root", async (c) => {
  const token = getCookie(c, "token");

  try {
    const decodedPayload = await verify(token, c.env.JWT_SECRET);

    const { results: otherUsers } = await c.env.DB.prepare(
      "select username from users where username != ?"
    )
      .bind(decodedPayload.username)
      .all();

    return c.json({
      loggedIn: true,
      username: decodedPayload.username,
      otherUsers: otherUsers,
    });
  } catch (e) {
    return c.json({
      loggedIn: false,
    });
  }
});

app.get("/question", async (c) => {
  const token = getCookie(c, "token");

  try {
    const decodedPayload = await verify(token, c.env.JWT_SECRET);

    let { results: user } = await c.env.DB.prepare(
      "select id from users where username = ?"
    )
      .bind(decodedPayload.username)
      .all();
    user = user[0];

    const { results } = await c.env.DB.prepare(
      "select question, answer from questions inner join users on users.id = questions.user_id where username = ?"
    )
      .bind(decodedPayload.username)
      .all();

    if (results.length === 0) {
      const questionAnswer = getQuestion(getTopic());
      const result = await c.env.DB.prepare(
        `insert into questions (user_id, question, answer) values (?, ?, ?)`
      )
        .bind(user.id, questionAnswer.question, String(questionAnswer.answer))
        .all();

      if (questionAnswer.question === "How many dots are in the box?") {
        return c.json({
          loggedIn: true,
          question: questionAnswer.question,
          count: questionAnswer.answer,
        });
      } else if (
        questionAnswer.question.includes("be inside the box after adding ")
      ) {
        return c.json({
          loggedIn: true,
          question: questionAnswer.question,
          count: questionAnswer.count,
        });
      } else {
        return c.json({
          loggedIn: true,
          question: questionAnswer.question,
        });
      }
    } else {
      if (results[0].question === "How many dots are in the box?") {
        return c.json({
          loggedIn: true,
          question: results[0].question,
          count: results[0].answer,
        });
      } else if (
        results[0].question.includes("be inside the box after adding ")
      ) {
        return c.json({
          loggedIn: true,
          question: results[0].question,
          count:
            Number(results[0].answer) -
            Number(results[0].question.slice(50, 52).trim()),
        });
      } else {
        return c.json({
          loggedIn: true,
          question: results[0].question,
        });
      }
    }
  } catch (e) {
    return c.json({
      loggedIn: false,
    });
  }
});

app.post("/question", async (c) => {
  const obj = await c.req.json();
  const token = getCookie(c, "token");
  const decodedPayload = await verify(token, c.env.JWT_SECRET);

  let { results: user } = await c.env.DB.prepare(
    "select id from users where username = ?"
  )
    .bind(decodedPayload.username)
    .all();
  user = user[0];

  const { results } = await c.env.DB.prepare(
    "select answer from questions inner join users on users.id = questions.user_id where username = ?"
  )
    .bind(decodedPayload.username)
    .all();

  if (results[0].answer == obj.answer) {
    const dartResult = hitDartboard(
      Math.floor(Math.random() * dartboard[dartboard.length - 1] + 1)
    );

    if (subset.includes(dartResult)) {
      const { results: insertResult } = await c.env.DB.prepare(
        `insert into user_pokemon (user_id, pokemon_id) values (?, ?)`
      )
        .bind(user.id, dartResult)
        .all();
      const { results: deleteResult } = await c.env.DB.prepare(
        `delete from questions where user_id = ?`
      )
        .bind(user.id)
        .all();
      return c.json({
        caught: true,
        username: decodedPayload.username,
      });
    } else {
      const { results: deleteResult } = await c.env.DB.prepare(
        `delete from questions where user_id = ?`
      )
        .bind(user.id)
        .all();
      return c.json({
        gotaway: true,
      });
    }
  } else {
    return c.json({
      caught: false,
    });
  }
});

app.post("/login", async (c) => {
  const cred = await c.req.json();

  const { results } = await c.env.DB.prepare(
    "select id from users where username = ? and password = ?"
  )
    .bind(cred.username, cred.password)
    .all();

  if (results.length === 1) {
    const payload = {
      username: cred.username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    };
    const token = await sign(payload, c.env.JWT_SECRET);

    setCookie(c, "token", token, {
      sameSite: "None",
      secure: true,
    });

    return c.json({
      success: true,
    });
  } else {
    return c.json({
      success: false,
    });
  }
});

app.get("/logout", async (c) => {
  setCookie(c, "token", "foobar", {
    sameSite: "None",
    secure: true,
  });

  return c.json({
    success: true,
  });
});

app.get("/user/:username", async (c) => {
  const { results: users } = await c.env.DB.prepare(
    "select id from users where username = ?"
  )
    .bind(c.req.param("username"))
    .all();

  if (users.length === 1) {
    const { results } = await c.env.DB.prepare(
      "select pokemon_id, name, description, color, sprite, imageUrl from user_pokemon inner join users on users.id = user_pokemon.user_id inner join pokemons on pokemons.id = user_pokemon.pokemon_id where username = ?"
    )
      .bind(c.req.param("username"))
      .all();

    return c.json(results.reverse());
  } else if (users.length === 0) {
    return c.json({
      user: "nonexistent",
    });
  }
});

app.get("/pokemon/:id", async (c) => {
  const id = c.req.param("id");

  const { results } = await c.env.DB.prepare(
    "select * from pokemons where id = ?"
  )
    .bind(id)
    .all();

  return c.json(results[0]);
});

export default app;

const topics = [
  "addition",
  "counting",
  "counting with addition",
  "max/min",
  "multiplication",
  "subtraction (positive only)",
];
function getQuestion(topic) {
  if (topic === "max/min") {
    let set = new Set();
    while (set.size !== 10) {
      const n = Math.floor(Math.random() * 150);
      set.add(n);
    }

    const arrayOfNumbers = Array.from(set);
    const max = Math.floor(Math.random() * 2);
    return {
      question: `The following is a list of numbers: ${arrayOfNumbers}. Which of the numbers is the ${
        max ? "biggest" : "smallest"
      }?`,
      answer: max ? Math.max(...arrayOfNumbers) : Math.min(...arrayOfNumbers),
    };
  } else if (topic === "multiplication") {
    const x = Math.floor(Math.random() * 8);
    const y = Math.floor(Math.random() * 8);

    return {
      question: `${x} * ${y} = ___`,
      answer: x * y,
    };
  } else if (topic === "addition") {
    const x = Math.floor(Math.random() * 50);
    const y = Math.floor(Math.random() * 50);

    return {
      question: `${x} + ${y} = ___`,
      answer: x + y,
    };
  } else if (topic === "subtraction (positive only)") {
    let x = Math.floor(Math.random() * 50);
    let y = Math.floor(Math.random() * 50);

    while (y > x) {
      x = Math.floor(Math.random() * 50);
      y = Math.floor(Math.random() * 50);
    }

    return {
      question: `${x} - ${y} = ___`,
      answer: x - y,
    };
  } else if (topic === "counting") {
    const max = 50;
    const min = 20;
    let n = Math.floor(Math.random() * max);
    while (n < min) {
      n = Math.floor(Math.random() * max);
    }

    return {
      question: "How many dots are in the box?",
      answer: n,
    };
  } else if (topic === "counting with addition") {
    const max = 25;
    const min = 10;
    let n = Math.floor(Math.random() * max);
    while (n < min) {
      n = Math.floor(Math.random() * max);
    }
    const increment = Math.floor(Math.random() * 25 + 2);

    return {
      question: `How many dots will be inside the box after adding ${increment} dots?`,
      answer: n + increment,
      count: n,
    };
  } else {
    return "that topic is not supported";
  }
}
function getTopic() {
  return topics[Math.floor(Math.random() * topics.length)];
}

const dartboard = [
  80, 100, 105, 185, 205, 210, 290, 310, 315, 2315, 4315, 4715, 6715, 8715,
  9115, 11115, 13115, 13515, 15515, 17515, 19515, 21515, 23515, 25515, 27515,
  29515, 29605, 29695, 31695, 33695, 34095, 36095, 38095, 38495, 40495, 40895,
  40985, 41075, 43075, 45075, 47075, 49075, 51075, 53075, 53475, 55475, 57475,
  59475, 61475, 63475, 65475, 65565, 65655, 67655, 69655, 71655, 72055, 74055,
  74455, 76455, 78455, 78855, 80855, 82855, 82862, 84862, 86862, 86869, 86959,
  87049, 87139, 89139, 89539, 91539, 93539, 93546, 95546, 95946, 97946, 99946,
  101946, 103946, 104026, 106026, 108026, 110026, 112026, 114026, 116026,
  118026, 118426, 120426, 122426, 122433, 124433, 126433, 128433, 130433,
  132433, 134433, 136433, 138433, 138833, 140833, 142833, 142913, 142993,
  143073, 145073, 147073, 149073, 151073, 153073, 155073, 157073, 159073,
  161073, 163073, 165073, 167073, 167473, 167553, 169553, 169633, 171633,
  171723, 171813, 173813, 175813, 175833, 175913, 177913, 177993, 178013,
  178033, 178053, 178133, 178213, 178233, 178313, 178333, 178413, 178433,
  178434, 178435, 178436, 178516, 178536, 178541, 178542, 178543,
];
const subset = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 23, 24, 25, 26, 27, 28, 35, 36, 37, 38, 39, 40, 43,
  44, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 69, 70,
  71, 72, 73, 74, 75, 76, 79, 80, 81, 82, 84, 85, 86, 87, 88, 89, 90, 91, 92,
  93, 94, 96, 97, 100, 101, 102, 103, 106, 107, 109, 110, 111, 112, 113, 116,
  117, 123, 125, 126, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 143,
  144, 145, 146, 147, 148, 149, 150, 151,
];
function hitDartboard(n) {
  if (n < dartboard[0]) {
    return 1;
  } else {
    for (let i = 1; i < dartboard.length; i++) {
      if (dartboard[i - 1] < n && n <= dartboard[i]) {
        return i + 1;
      }
    }
  }

  // let lb = 0;
  // let hb = dartboard.length - 1;

  // while (lb !== hb) {
  //   console.log(lb, hb); ///////////////////////
  //   const i = Math.floor((hb - lb) / 2 + lb);
  //   if (dartboard[i - 1] < n && n <= dartboard[i]) {
  //     return i + 1;
  //   } else if (n <= dartboard[i - 1]) {
  //     hb = i - 1;
  //   } else if (dartboard[i] < n) {
  //     lb = i;
  //   }

  //   if (lb === dartboard.length - 2) {
  //     return dartboard.length;
  //   }
  // }

  // if (lb === hb) {
  //   return 1;
  // }
}
