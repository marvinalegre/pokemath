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
  const codes = [
    "a",
    "c",
    "a2",
    "ar2",
    "b",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "aa",
    "ab",
    "ac",
    "ad",
    "ae",
    "af",
  ];
  const index = Math.floor(Math.random() * codes.length);
  return codes[index];
}

function getParametersAndAnswer(code) {
  if (code === "af") {
    const isAddition = Math.random() > 0.5;
    let x, y;
    if (isAddition) {
      x = Math.floor(Math.random() * 30) + 20;
      y = Math.floor(Math.random() * 30) + 20;
    } else {
      x = Math.ceil(Math.random() * 30) + 50;
      y = Math.ceil(Math.random() * 30) + 20;

      while (y > x) {
        y = Math.ceil(Math.random() * 30) + 20;
      }
    }
    const additionProblems = [
      `There are ${x} apples in one basket and ${y} apples in another. How many apples are there in total?`,
      `A library has ${x} books on one shelf and ${y} books on another. How many books are there altogether?`,
      `Tom has ${x} toy cars and gets ${y} more for his birthday. How many toy cars does he have now?`,
      `A class has ${x} boys and ${y} girls. How many students are there in the class?`,
      `A bird laid ${x} eggs on Monday and ${y} eggs on Tuesday. How many eggs did it lay in total?`,
      `There are ${x} red balloons and ${y} blue balloons. How many balloons are there in total?`,
      `You walked ${x} steps in the morning and ${y} steps in the afternoon. How many steps did you walk today?`,
      `Sarah read ${x} pages in the morning and ${y} pages in the evening. How many pages did she read in total?`,
      `There are ${x} chairs in one room and ${y} in another. How many chairs are there altogether?`,
      `A farmer has ${x} cows and ${y} goats. How many animals does he have in total?`,
      `Lisa built ${x} blocks and added ${y} more. How many blocks are there now?`,
      `There are ${x} students in one group and ${y} in another. How many students are there in both groups?`,
      `A tree has ${x} apples and another has ${y}. How many apples are there in total?`,
      `Mark has ${x} pencils and finds ${y} more in his backpack. How many pencils does he have now?`,
      `In a box, there are ${x} red balls and ${y} green balls. How many balls are in the box?`,
      `A train has ${x} passengers in one coach and ${y} in another. How many passengers are on the train?`,
      `There are ${x} stars in the sky tonight and ${y} shooting stars. How many stars did you see in total?`,
      `You collected ${x} stickers on Monday and ${y} on Tuesday. How many stickers do you have now?`,
      `There are ${x} ducks on one pond and ${y} on another. How many ducks are there in total?`,
      `Emma picked ${x} flowers in the morning and ${y} in the afternoon. How many flowers did she pick today?`,
    ];
    const subtractionProblems = [
      `There were ${x} apples in the basket. ${y} apples were taken out. How many are left?`,
      `A library had ${x} books. ${y} books were borrowed. How many books are still on the shelves?`,
      `Tom had ${x} toy cars but gave ${y} to his friend. How many does he have left?`,
      `A class had ${x} students. ${y} went on a field trip. How many students stayed behind?`,
      `A bird laid ${x} eggs, but ${y} eggs broke. How many eggs are left?`,
      `There were ${x} balloons at the party. ${y} balloons popped. How many balloons remain?`,
      `You planned to walk ${x} steps today but stopped after ${y}. How many steps short did you fall?`,
      `Sarah had ${x} pages to read and already read ${y}. How many pages does she have left?`,
      `There were ${x} chairs before the meeting. ${y} were taken to another room. How many are left?`,
      `A farmer had ${x} cows. ${y} were sold. How many cows does he still have?`,
      `Lisa built ${x} blocks but ${y} blocks fell down. How many are still standing?`,
      `There were ${x} students at recess. ${y} went back to class. How many are still outside?`,
      `A tree had ${x} apples. ${y} fell to the ground. How many apples remain on the tree?`,
      `Mark had ${x} pencils but lost ${y}. How many pencils does he still have?`,
      `In a box, there were ${x} balls. ${y} balls were taken out. How many balls are left?`,
      `A train started with ${x} passengers. ${y} got off at the next station. How many are still on board?`,
      `You saw ${x} stars last night, but ${y} were hidden by clouds. How many could you still see?`,
      `You had ${x} stickers, but gave ${y} to a friend. How many do you have now?`,
      `There were ${x} ducks on the pond. ${y} flew away. How many ducks are still there?`,
      `Emma picked ${x} flowers but dropped ${y} on the way. How many flowers does she still have?`,
    ];

    const output = { qParameters: {} };
    if (isAddition) {
      output.qAnswer = x + y;
    } else {
      output.qAnswer = x - y;
    }
    output.qParameters = {
      question: isAddition
        ? additionProblems[Math.floor(Math.random() * additionProblems.length)]
        : subtractionProblems[
            Math.floor(Math.random() * subtractionProblems.length)
          ],
    };
    return output;
  } else if (code === "ae") {
    const isSum = Math.random() > 0.5;
    let x, y;
    if (isSum) {
      if (Math.random() > 0.5) {
        x = Math.ceil(Math.random() * 8999) + 1000;
        y = Math.ceil(Math.random() * 8999) + 1000;
      } else {
        x = Math.ceil(Math.random() * 899) + 100;
        y = Math.ceil(Math.random() * 899) + 100;
      }
    } else {
      if (Math.random() > 0.5) {
        x = Math.ceil(Math.random() * 8999) + 1000;
        y = Math.ceil(Math.random() * 8999) + 1000;

        while (y > x) {
          y = Math.ceil(Math.random() * 8999) + 1000;
        }
      } else {
        x = Math.ceil(Math.random() * 899) + 100;
        y = Math.ceil(Math.random() * 899) + 100;

        while (y > x) {
          y = Math.ceil(Math.random() * 899) + 100;
        }
      }
    }

    const output = { qParameters: {} };
    if (isSum) {
      output.qAnswer =
        roundToLargestPlaceValue(x) + roundToLargestPlaceValue(y);
    } else {
      output.qAnswer =
        roundToLargestPlaceValue(x) - roundToLargestPlaceValue(y);
    }
    output.qParameters = { x, y, isSum };
    return output;
  } else if (code === "ad") {
    const hasLessCapacity = Math.random() > 0.5;
    const isSameUnit = Math.random() > 0.5;
    const x = Math.ceil(Math.random() * 5) + 5;
    const y = Math.ceil(Math.random() * 8) * 0.5 + x;
    const liquids = [
      "water",
      "milk",
      "juice",
      "oil",
      "vinegar",
      "syrup",
      "honey",
      "soy sauce",
      "coffee",
      "tea",
    ];
    const [liq1, liq2] = getTwoUniqueNames(liquids);
    const hash = {
      [liq1]: [x],
      [liq2]: [y],
    };

    const output = { qParameters: {} };
    if (hasLessCapacity) {
      output.qAnswer = liq1;
    } else {
      output.qAnswer = liq2;
    }
    if (isSameUnit) {
      const useL = Math.random() > 0.5;
      if (useL) {
        output.qParameters.question = `Which has ${hasLessCapacity ? "less" : "more"} capacity: ${hash[liq1]} L of ${liq1} or ${hash[liq2]} L of ${liq2}?`;
      } else {
        output.qParameters.question = `Which has ${hasLessCapacity ? "less" : "more"} capacity: ${hash[liq1] * 1000} mL of ${liq1} or ${hash[liq2] * 1000} mL of ${liq2}?`;
      }
    } else {
      output.qParameters.question = `Which has ${hasLessCapacity ? "less" : "more"} capacity: ${hash[liq1]} L of ${liq1} or ${hash[liq2] * 1000} mL of ${liq2}?`;
    }

    return output;
  } else if (code === "ac") {
    const isLighter = Math.random() > 0.5;
    const isSameUnit = Math.random() > 0.5;
    const x = Math.ceil(Math.random() * 5) + 5;
    const y = Math.ceil(Math.random() * 8) * 0.5 + x;
    const vegetables = ["okra", "squash", "carrots", "potatoes", "spinach"];
    const [veg1, veg2] = getTwoUniqueNames(vegetables);
    const hash = {
      [veg1]: [x],
      [veg2]: [y],
    };

    const output = { qParameters: {} };
    if (isLighter) {
      output.qAnswer = veg1;
    } else {
      output.qAnswer = veg2;
    }
    if (isSameUnit) {
      const useKg = Math.random() > 0.5;
      if (useKg) {
        output.qParameters.question = `Which is ${isLighter ? "lighter" : "heavier"}: ${hash[veg1]} kg of ${veg1} or ${hash[veg2]} kg of ${veg2}?`;
      } else {
        output.qParameters.question = `Which is ${isLighter ? "lighter" : "heavier"}: ${hash[veg1] * 1000} g of ${veg1} or ${hash[veg2] * 1000} g of ${veg2}?`;
      }
    } else {
      output.qParameters.question = `Which is ${isLighter ? "lighter" : "heavier"}: ${hash[veg1]} kg of ${veg1} or ${hash[veg2] * 1000} g of ${veg2}?`;
    }

    return output;
  } else if (code === "ab") {
    const x = Math.floor(Math.random() * 900) + 100;
    let y = Math.floor(Math.random() * 100);

    return {
      qAnswer: x - y,
      qParameters: { x, y },
    };
  } else if (code === "aa") {
    const x = Math.floor(Math.random() * 900) + 100;
    const y = Math.floor(Math.random() * 100);
    return { qAnswer: x + y, qParameters: { x, y } };
  } else if (code === "z") {
    const { expression, result } = generateSafeExpression();

    return {
      qAnswer: result,
      qParameters: {
        expression,
      },
    };

    function generateSafeExpression(terms = 5, maxTermValue = 20) {
      let expression = "";
      let currentValue = Math.floor(Math.random() * maxTermValue) + 1; // Start with a positive number
      expression += currentValue;

      for (let i = 1; i < terms; i++) {
        let operator;
        let nextNumber;

        // If currentValue is 0, we must add (can't subtract from 0)
        if (currentValue === 0) {
          operator = "+";
        } else {
          operator = Math.random() < 0.5 ? "+" : "-";
        }

        if (operator === "+") {
          nextNumber = Math.floor(Math.random() * maxTermValue) + 1;
          currentValue += nextNumber;
        } else {
          // Subtract only up to currentValue to avoid going negative
          nextNumber = Math.floor(Math.random() * currentValue) + 1;
          currentValue -= nextNumber;
        }

        expression += ` ${operator} ${nextNumber}`;
      }

      return {
        expression,
        result: currentValue,
      };
    }
  } else if (code === "y") {
    const names = [
      "Anna",
      "Ben",
      "Carla",
      "David",
      "Ella",
      "Frank",
      "Grace",
      "Henry",
      "Isla",
      "Jake",
      "Kara",
      "Leo",
      "Mia",
      "Noah",
      "Olivia",
    ];
    const [name1, name2] = getTwoUniqueNames(names);
    const moneyProblems = [
      `${name2} paid for a notebook with two ten-peso coins. ${name1} bought a pen and paid with two twenty-peso bill. Who spent more?`,
      `${name1} gave the vendor four five-peso coins for a sandwich. ${name2} paid with a ten-peso coin for a drink. Who spent more?`,
      `${name2} bought snacks for 20 pesos. ${name1} bought a drink for 52 pesos. Who spent more money?`,
      `${name1} gave the cashier 55 pesos for a book. ${name2} gave 20 pesos for a notebook. Who spent more?`,
      `${name2} used one 50-peso bill to pay for lunch. ${name1} paid using three 20-peso bills and a ten-peso coin. Who spent more?`,
      `${name2} paid three ten-peso coins for a toy. ${name1} paid two twenty-peso bills for a puzzle. Who spent more money?`,
      `${name2} gave six five-peso coins to buy a ruler. ${name1} paid with one fifty-peso bill for a pair of scissors. Who spent more?`,
      `${name1} bought a coloring book for 45 pesos. ${name2} bought crayons for 40 pesos. Who spent more?`,
      `${name1} spent 75 pesos on lunch, while ${name2} spent 30 pesos on snacks. Who spent more money?`,

      `${name1} bought a sandwich for 20 pesos. ${name2} bought a juice for 18 pesos. Who spent more money?`,
      `${name2} gave two twenty-peso bills to buy a toy. ${name1} paid with one fifty-peso bill for a different toy. Who spent more?`,
      `${name1} used five five-peso coins to buy a notebook. ${name2} paid with two ten-peso coins. Who spent more?`,
      `${name1} paid 45 pesos for a puzzle. ${name2} paid 40 pesos for a board game. Who spent more money?`,
      `${name1} gave two 100-peso bill to buy a backpack. ${name2} paid with two 50-peso bills for a school bag. Who spent more?`,
      `${name1} spent 60 pesos on school supplies. ${name2} spent 55 pesos on art materials. Who spent more?`,
      `${name2} bought three items that cost 15 pesos each. ${name1} bought two items that cost 25 pesos each. Who spent more money?`,
      `${name1} gave one fifty-peso bill and one twenty-peso bill for a toy car. ${name2} gave three twenty-peso bills for a doll. Who spent more?`,
      `${name2} spent 60 pesos at the canteen. ${name1} spent 75 pesos at the bookstore. Who spent more money?`,
      `${name1} bought lunch and paid with two fifty-peso bills. ${name2} bought lunch and paid with four twenty-peso bills. Who spent more?`,
    ];

    return {
      qAnswer: name1,
      qParameters: {
        question:
          moneyProblems[Math.floor(Math.random() * moneyProblems.length)],
        name1,
        name2,
      },
    };
  } else if (code === "x") {
    const x = Math.floor(Math.random() * 30) + 20;
    const y = Math.floor(Math.random() * 30) + 20;

    const moneyProblems = [
      `Maria has ${x} pesos and her brother gave her ${y} pesos. How much money does Maria have now?`,
      `John earned ${x} pesos from selling lemonade and ${y} pesos from doing chores. What is his total income?`,
      `Emma received ${x} pesos for her graduation and ${y} pesos from her grandparents. How much money did she get in total?`,
      `Liam found ${x} pesos in his piggy bank and added another ${y} pesos. How much money does he have now?`,
      `A vendor earned ${x} pesos in the morning and ${y} pesos in the afternoon. How much did he earn in total that day?`,
      `Sophie had ${x} pesos. Her parents gave her ${y} pesos more. How much money does she have altogether?`,
      `Carlos collected ${x} pesos from his classmates and ${y} pesos from his teacher for a donation. How much money was collected in total?`,
      `Nina saved ${x} pesos last month and ${y} pesos this month. How much has she saved so far?`,
      `Ben picked up ${x} pesos from the ground and later found another ${y} pesos. What is the total amount he found?`,
    ];

    return {
      qAnswer: x + y,
      qParameters: {
        question:
          moneyProblems[Math.floor(Math.random() * moneyProblems.length)],
        x,
        y,
      },
    };
  } else if (code === "w") {
    const x = Math.floor(Math.random() * 600) + 400;
    let y = Math.floor(Math.random() * 900) + 100;

    while (y > x) {
      y = Math.floor(Math.random() * 900) + 100;
    }

    return {
      qAnswer: x - y,
      qParameters: {
        x,
        y,
      },
    };
  } else if (code === "v") {
    const x = Math.floor(Math.random() * 900) + 100;
    const y = Math.floor(Math.random() * 900) + 100;
    const z = Math.floor(Math.random() * 900) + 100;

    return {
      qAnswer: x + y + z,
      qParameters: {
        x,
        y,
        z,
      },
    };
  } else if (code === "u") {
    const lToMl = Math.random() > 0.5;
    const x = Math.ceil(Math.random() * 50);

    return {
      qAnswer: lToMl ? x * 1000 : x,
      qParameters: {
        x,
        lToMl,
      },
    };
  } else if (code === "t") {
    const kgToGrams = Math.random() > 0.5;
    const x = Math.ceil(Math.random() * 50);

    return {
      qAnswer: kgToGrams ? x * 1000 : x,
      qParameters: {
        x,
        kgToGrams,
      },
    };
  } else if (code === "s") {
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

function getTwoUniqueNames(nameList) {
  const shuffled = [...nameList].sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1]];
}

function roundToLargestPlaceValue(num) {
  if (num === 0) return 0;

  const digits = Math.floor(Math.log10(Math.abs(num))); // Find the number of digits - 1
  const placeValue = Math.pow(10, digits); // Get the largest place value
  return Math.round(num / placeValue) * placeValue;
}
