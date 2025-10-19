import { customAlphabet } from "nanoid";
const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
);
import db from "../database/db.js";
import { bot, chatId } from "../telegram-bot.js";
import { ToWords } from "to-words";

const latest = (req, res) => {
  const { id, username } = req.user;
  const result = db
    .prepare(
      "select * from user_pokemons where user_id = ? order by caught_at desc limit 1",
    )
    .bind(id)
    .all();

  if (result.length === 0) {
    return res.render("latest-catch", { username });
  }

  // TODO: manage csrfTokens
  res.render("latest-catch", {
    username,
    pokemonId: result[0].pokemon_id,
    pokemonExtId: result[0].user_pokemon_ext_id,
  });
};

const dealWithLatest = (req, res) => {
  if (req.body.release === "true") {
    db.prepare(
      "delete from user_pokemons where user_id = ? and user_pokemon_ext_id = ?",
    )
      .bind(req.user.id, req.body.pokemonExtId)
      .run();
  }
  if (req.body.redirect) {
    return res.redirect(req.body.redirect);
  }
  res.redirect("/catch");
};

const catchForm = (req, res) => {
  const { username, id } = req.user;

  const questions = db
    .prepare(
      "select question_code, question_parameters from user_questions where user_id = ?",
    )
    .bind(id)
    .all();

  if (questions.length === 1) {
    return res.render("question", {
      username,
      generalError: undefined,
      qCode: questions[0].question_code,
      qParameters: JSON.parse(questions[0].question_parameters),
    });
  }

  const qCode = getCode();
  const { qParameters, qAnswer } = getParametersAndAnswer(qCode);

  res.render("question", {
    username,
    generalError: undefined,
    qCode,
    qParameters,
  });

  db.prepare(
    "insert into user_questions (user_id, question_code, question_parameters, answer) values (?, ?, ?, ?)",
  )
    .bind(id, qCode, JSON.stringify(qParameters), String(qAnswer))
    .run();
};

const catchHandler = async (req, res) => {
  const { answer } = req.body;
  const { username, id } = req.user;

  const questions = db
    .prepare(
      "select answer, question_parameters, question_code from user_questions where user_id = ?",
    )
    .bind(id)
    .all();

  // record submitted answers
  db.prepare(
    "insert into question_log (user_id, answer, correct_answer, question_code, question_parameters) values (?, ?, ?, ?, ?)",
  )
    .bind(
      id,
      answer,
      questions[0].answer,
      questions[0].question_code,
      questions[0].question_parameters,
    )
    .run();

  if (questions[0].answer !== answer) {
    return res.render("question", {
      username,
      generalError: "Wrong answer.",
      qCode: questions[0].question_code,
      qParameters: JSON.parse(questions[0].question_parameters),
    });
  }

  db.prepare("delete from user_questions where user_id = ?").bind(id).run();

  const die = rollDie();
  if (die === "got away") {
    const qCode = getCode();
    const { qParameters, qAnswer } = getParametersAndAnswer(qCode);

    db.prepare(
      "insert into user_questions (user_id, question_code, question_parameters, answer) values (?, ?, ?, ?)",
    )
      .bind(id, qCode, JSON.stringify(qParameters), String(qAnswer))
      .run();

    return res.render("question", {
      username,
      generalError: "The pokemon got away.",
      qCode,
      qParameters,
    });
  }

  const pokemons = db
    .prepare("select id from pokemons where availability = ?")
    .bind(die)
    .all();

  const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
  const extId = nanoid();

  let experience = null;
  if (
    db
      .prepare("select evolution_id from pokemons where id = ?")
      .bind(randomPokemon.id)
      .all()[0].evolution_id
  ) {
    experience = 0;
  }

  db.prepare(
    "insert into user_pokemons (user_pokemon_ext_id, user_id, pokemon_id, experience) values (?, ?, ?, ?)",
  )
    .bind(extId, id, randomPokemon.id, experience)
    .run();

  db.prepare(
    "insert into pokemon_catch_log (user_id, pokemon_id, user_pokemon_ext_id) values (?, ?, ?)",
  )
    .bind(id, randomPokemon.id, extId)
    .run();

  res.redirect("/catch/latest");
  await bot.telegram.sendMessage(chatId, `${username} just caught a pokemon!`);
};

export default { latest, dealWithLatest, catchForm, catchHandler };

function distance(pt1, pt2) {
  // Calculate the difference in x and y coordinates
  const dx = pt2[0] - pt1[0]; // x2 - x1
  const dy = pt2[1] - pt1[1]; // y2 - y1

  // Calculate the distance using the Pythagorean theorem
  return Math.sqrt(dx * dx + dy * dy);
}

function rollDie() {
  const r = Math.floor(Math.random() * 1_000_000) + 1;

  if (r <= 333_333) return "got away";
  else if (r <= 871_799) return "C";
  else if (r <= 950_000) return "CE";
  else if (r <= 971_799) return "CEE";
  else if (r <= 980_799) return "R";
  else if (r <= 982_799) return "RE";
  else if (r <= 983_599) return "REE";
  else if (r <= 995_599) return "T";
  else if (r <= 997_599) return "TE";
  else if (r <= 998_399) return "TEE";
  else if (r <= 999_399) return "H";
  else if (r <= 999_899) return "HE";
  else if (r <= 999_999) return "HEE";
  else return "L";
}

function getCode() {
  const codes = ["s"];
  const index = Math.floor(Math.random() * codes.length);
  return codes[index];
}

function getParametersAndAnswer(code) {
  if (code === "s") {
    const p = Math.ceil(Math.random() * 1_990) + 10;
    const c = Math.floor(Math.random() * 100);
    const toWords = new ToWords({ localeCode: "en-PH" });
    let pWords = toWords.convert(p).toLowerCase();
    let cWords = toWords.convert(c).toLowerCase();

    const pLastTwoDigits = getLastTwoDigits(p);
    const cLastTwoDigits = getLastTwoDigits(c);

    if (pLastTwoDigits > 20 && pLastTwoDigits % 10 !== 0) {
      pWords = pWords.replace(
        toWords.convert(pLastTwoDigits).toLowerCase(),
        toWords.convert(pLastTwoDigits).toLowerCase().replace(" ", "-"),
      );
    }

    if (cLastTwoDigits > 20 && cLastTwoDigits % 10 !== 0) {
      cWords = cWords.replace(
        toWords.convert(cLastTwoDigits).toLowerCase(),
        toWords.convert(cLastTwoDigits).toLowerCase().replace(" ", "-"),
      );
    }

    let moneyInWords = `${pWords} pesos`;
    if (c > 1) {
      moneyInWords += ` and ${cWords} centavos`;
    } else if (c === 1) {
      moneyInWords += ` and ${cWords} centavo`;
    }

    return {
      qAnswer: moneyInWords,
      qParameters: {
        money: `${p}.${c > 9 ? c : `0${c}`}`,
      },
    };
  } else if (code === "r") {
    const p = Math.ceil(Math.random() * 1_990) + 10;
    const c = Math.floor(Math.random() * 100);
    const toWords = new ToWords({ localeCode: "en-PH" });
    let pWords = toWords.convert(p).toLowerCase();
    let cWords = toWords.convert(c).toLowerCase();

    const pLastTwoDigits = getLastTwoDigits(p);
    const cLastTwoDigits = getLastTwoDigits(c);

    if (pLastTwoDigits > 20 && pLastTwoDigits % 10 !== 0) {
      pWords = pWords.replace(
        toWords.convert(pLastTwoDigits).toLowerCase(),
        toWords.convert(pLastTwoDigits).toLowerCase().replace(" ", "-"),
      );
    }

    if (cLastTwoDigits > 20 && cLastTwoDigits % 10 !== 0) {
      cWords = cWords.replace(
        toWords.convert(cLastTwoDigits).toLowerCase(),
        toWords.convert(cLastTwoDigits).toLowerCase().replace(" ", "-"),
      );
    }

    let moneyInWords = `${pWords} pesos`;
    if (c > 1) {
      moneyInWords += ` and ${cWords} centavos`;
    } else if (c === 1) {
      moneyInWords += ` and ${cWords} centavo`;
    }

    return {
      qAnswer: `${p}.${c > 9 ? c : `0${c}`}`,
      qParameters: {
        moneyInWords,
      },
    };
  } else if (code === "q") {
    const x = Math.floor(Math.random() * 11);
    const y = Math.floor(Math.random() * 11);
    const position = Math.floor(Math.random() * 2);

    return {
      qAnswer: position === 0 ? y : x,
      qParameters: {
        x,
        y,
        position,
      },
    };
  } else if (code === "p") {
    const set = new Set();
    while (set.size !== 10) {
      set.add(Math.floor(Math.random() * 100));
    }

    const position = Math.ceil(Math.random() * 8) + 2;

    return {
      qAnswer: [...set][position - 1],
      qParameters: {
        numbers: [...set],
        position,
      },
    };
  } else if (code === "o") {
    const set = new Set();
    while (set.size !== 3) {
      set.add(Math.floor(Math.random() * 100));
    }

    const min = Math.random() > 0.5;

    return {
      qAnswer: min ? Math.min(...set) : Math.max(...set),
      qParameters: {
        numbers: [...set],
        type: min ? "min" : "max",
      },
    };
  } else if (code === "n") {
    const x = Math.floor(Math.random() * 3) + 2;
    const y = Math.floor(Math.random() * 8) + 2;

    const phrases = [
      `Anne has ${x} ten-peso coins and ${y} five-peso coins. How much money does he have?`,
      `Anne owns ${x} ten-peso coins and ${y} five-peso coins. What is the total amount of money he has?`,
      `How much money does Anne have if he has ${x} 10-peso coins and ${y} 5-peso coins?`,
      `Anne has a collection of coins: ${x} coins worth 10 pesos each and ${y} coins worth 5 pesos each. What is their total value?`,
      `Calculate the total amount Anne has if he holds ${x} ten-peso coins and ${y} five-peso coins.`,
      `Anne's wallet contains ${x} coins of 10 pesos and ${y} coins of 5 pesos. What is the sum of his money?`,
      `Anne emptied his piggy bank and found ${x} ten-peso coins and ${y} five-peso coins. How much money did he save?`,
      `Anne was paid in coins: ${x} ten-peso coins and ${y} five-peso coins. How much was he paid?`,
      `After shopping, Anne had ${x} ten-peso coins and ${y} five-peso coins left. How much money does he still have?`,
      `Anne is counting his change: ${x} coins worth 10 pesos and ${y} coins worth 5 pesos. How much does he have in total?`,
    ];

    return {
      qAnswer: x * 10 + y * 5,
      qParameters: {
        question: phrases[Math.floor(Math.random() * phrases.length)],
      },
    };
  } else if (code === "l") {
    const x = Math.floor(Math.random() * 11);

    return { qAnswer: 10 - x, qParameters: { x } };
  } else if (code === "k") {
    const x = Math.floor(Math.random() * 100);

    if (x < 10) {
      return { qAnswer: 0, qParameters: { x } };
    }

    return { qAnswer: Number(String(x)[0]), qParameters: { x } };
  } else if (code === "j") {
    const x = Math.ceil(Math.random() * 4) + 10;
    const y = Math.floor(Math.random() * 5) + 5;

    return { qAnswer: x - y, qParameters: { x, y } };
  } else if (code === "i") {
    const x = Math.ceil(Math.random() * 89) + 10;
    const placeValue = Math.ceil(Math.random() * 2);

    return {
      qAnswer: placeValue === 1 ? String(x)[1] : String(x)[0] * 10,
      qParameters: {
        addends:
          placeValue === 1
            ? `${String(x)[0] * 10} + ___`
            : `___ + ${String(x)[1]}`,
        x,
      },
    };
  } else if (code === "h") {
    const i = Math.ceil(Math.random() * 8) + 2;
    const n = Math.ceil(Math.random() * 6) + 4;

    return {
      qAnswer: i * n,
      qParameters: {
        sequence: generateSequence(i, n),
      },
    };

    function generateSequence(i, n) {
      const totalTerms = 10;
      const result = [];

      for (let j = 1; j <= totalTerms; j++) {
        if (j === i) {
          result.push("___");
        } else {
          result.push(n * j);
        }
      }

      return result.join(", ");
    }
  } else if (code === "g") {
    const x = Math.ceil(Math.random() * 9_900) + 99;
    let placeValue;
    if (x <= 999) {
      placeValue = Math.ceil(Math.random() * 2);
    } else {
      placeValue = Math.ceil(Math.random() * 3);
    }

    return {
      qAnswer: roundToNearest(x, 10 ** placeValue),
      qParameters: {
        x,
        placeValue,
      },
    };

    function roundToNearest(value, place) {
      return Math.round(value / place) * place;
    }
  } else if (code === "f") {
    const x = Math.ceil(Math.random() * 1_900) + 100;
    const toWords = new ToWords({ localeCode: "en-PH" });
    let words = toWords.convert(x).toLowerCase();

    return {
      qAnswer: x,
      qParameters: {
        numberInWords: words,
      },
    };
  } else if (code === "e") {
    const x = Math.floor(Math.random() * 6) + 15;
    const y = Math.floor(Math.random() * 3) + 3;

    const phrases = [
      `If a single box can carry just ${y} toys, how many boxes are required to store all ${x} of Juan's toys?`,
      `Given that one box holds ${y} toys, how many boxes will it take to pack all ${x} of Juan's toys?`,
      `Each box has a capacity of ${y} toys. How many boxes are necessary for Juan's collection of ${x} toys?`,
      `Juan has ${x} toys, and each box fits only ${y}. What is the total number of boxes needed?`,
      `With each box fitting ${y} toys, how many boxes must be used to store all ${x} of Juan's toys?`,
      `You can only place ${y} toys in a box. How many boxes will you need for all ${x} of Juan's toys?`,
      `If boxes can contain only ${y} toys each, how many are needed to hold all ${x} of Juan's toys?`,
    ];

    return {
      qAnswer: Math.ceil(x / y),
      qParameters: {
        question: phrases[Math.floor(Math.random() * phrases.length)],
      },
    };
  } else if (code === "d") {
    const x = Math.floor(Math.random() * 9) + 6;
    const y = Math.floor(Math.random() * 5) + 1;

    const phrases = [
      `What do you get when you subtract ${y} from ${x}?`,
      `What is ${x} minus ${y}?`,
      `What’s the result of ${x} − ${y}?`,
      `What number do you get by taking ${y} away from ${x}?`,
      `If you have ${x} and lose ${y}, how many are left?`,
      `Start with ${x} and take away ${y} — what’s left?`,
      `Imagine you had ${x} and gave away ${y} — how many do you have now?`,
      `You had ${x}, then removed ${y} — what’s the result?`,
      `Take ${y} off of ${x} — what number do you get?`,
      `What number is ${y} smaller than ${x}?`,
      `What number is ${y} less than ${x}?`,
    ];

    return {
      qAnswer: x - y,
      qParameters: {
        question: phrases[Math.floor(Math.random() * phrases.length)],
      },
    };
  } else if (code === "b") {
    const x = Math.floor(Math.random() * 9) + 1;
    let y = Math.floor(Math.random() * 9) + 1;
    while (x === y) {
      y = Math.floor(Math.random() * 9) + 1;
    }

    const phrases = [
      `What do you get when you add ${x} to ${y}?`,
      `What is the sum of ${y} and ${x}?`,
      `How much is ${y} plus ${x}?`,
      `What number results from adding ${x} to ${y}?`,
      `What is the result of ${y} + ${x}?`,
      `If you add ${x} to ${y}, what do you get?`,
      `Start with ${y} and add ${x} — what’s the total?`,
      `Imagine you have ${y} and someone gives you ${x} more — how many do you have now?`,
      `What do you end up with if you add ${x} more to ${y}?`,
      `You’ve got ${y}, then gain ${x} — what’s your new total?`,
      `What number is ${x} units greater than ${y}?`,
      `Which number is ${x} more than ${y}?`,
      `What’s the next number after increasing ${y} by ${x}?`,
      `By increasing ${y} by ${x}, what number do you reach?`,
      `What value do you get by adding ${x} more to the number ${y}?`,
    ];

    return {
      qAnswer: x + y,
      qParameters: {
        question: phrases[Math.floor(Math.random() * phrases.length)],
      },
    };
  } else if (code === "c") {
    // counting
    const randomNumber = (Math.round(Math.random() * 10) % 10) + 5;
    const centers = [];
    while (centers.length !== (1 === randomNumber ? 11 : randomNumber)) {
      const center = [
        Math.floor(Math.random() * (230 - 10 + 1)) + 10,
        Math.floor(Math.random() * (230 - 10 + 1)) + 10,
      ];

      let count = 0;
      for (let c of centers) {
        if (distance(c, center) >= 20) count++;
      }
      if (count === centers.length) centers.push(center);
    }
    return { qAnswer: randomNumber, qParameters: centers };
  } else if (code === "a") {
    // addition
    const x = Math.floor(Math.random() * 13);
    const y = Math.floor(Math.random() * 13);
    return { qAnswer: x + y, qParameters: { x, y } };
  } else if (code === "a2") {
    const x = Math.floor(Math.random() * 80) + 20;
    const y = Math.floor(Math.random() * 80) + 20;
    return { qAnswer: x + y, qParameters: { x, y } };
  } else if (code === "ar") {
    // repeated addition
    const x = Math.floor(Math.random() * 5) + 1;
    const n = Math.floor(Math.random() * 5) + 3;
    return { qAnswer: x * n, qParameters: { x, n } };
  } else if (code === "ar2") {
    const x = Math.floor(Math.random() * 5) + 4;
    const n = Math.floor(Math.random() * 5) + 5;
    return { qAnswer: x * n, qParameters: { x, n } };
  } else if (code === "m") {
    // multiplication
    const x = Math.floor(Math.random() * 11);
    const y = Math.floor(Math.random() * 11);
    return { qAnswer: x * y, qParameters: { x, y } };
  }
}

function getLastTwoDigits(num) {
  let str = num.toString();

  if (str.length >= 2) {
    return Number(str.slice(-2));
  } else {
    return Number(str);
  }
}
