// let block = [[0], [2, 6, 7, 8, 1, 9], [], [3], [4], [5], [], [], [], []]
const inquirer = require("inquirer");
const Joi = require('@hapi/joi');

const schemas = {
  number: () => Joi.object({
    number: Joi.number().min(1).max(24).required()
  }),
  choice: () => Joi.object({
    choice: Joi.number().valid(1, 2, 3, 4, 5).required()
  }),
  block: (n) => Joi.object({
    block: Joi.number().valid(...n).required()
  }),
}

const validate = (obj, a, n) => {
  const { error } = schemas[a](n).validate(obj)
  if (error) {
    return error.details[0].message
  }
  return true
}

const questions = {
  input: [
    {
      type: "input",
      name: "blocks",
      message: "Enter the number:",
      validate: e => validate({ number: e }, 'number', null)
    },
  ],
  choice: [
    {
      type: "input",
      name: "choice",
      message: "Enter your choice:",
      validate: e => validate({ choice: e }, 'choice', null)
    },
  ],
  blockVal: (v, n) => [
    {
      type: "input",
      name: v,
      message: `Enter the value of ${v}`,
      validate: e => validate({ block: e }, 'block', n)
    },
  ],
};




const ssd = async (array, n) => {
  let quit = false;
  while (!quit) {
    console.clear()
    console.log("1:", "Move a onto b.");
    console.log("2:", "Move a over b.");
    console.log("3:", "Pile a onto b.");
    console.log("4:", "Pile a over b.");
    console.log("5:", "Quit.");
    const { choice } = await inquirer.prompt(questions["choice"]);
    if (choice === "5") {
      quit = true;
    } else {
      const { a } = await inquirer.prompt(questions.blockVal("a", n));
      const { b } = await inquirer.prompt(questions.blockVal("b", n));

      switch (choice) {
        case "1": {
          array[b].push(Number(a));
          delete array[a][0];
          break;
        }
        case "2": {
          array[b] = [Number(a), ...array[b]];
          delete array[a][0];
          break;
        }
        case "3": {
          array[b] = [...array[b], ...array[a]];
          array[a] = [];
          break;
        }
        case "4": {
          array[b] = [...array[a], ...array[b]];
          array[a] = [];
          break;
        }
      }
    }
  }
  return array;
};

inquirer.prompt(questions["input"]).then(async ({ blocks }) => {
  let arr = [...Array(Number(blocks)).keys()]; 
  let array = arr.map((i) => [i]);
  const res = await ssd(array, arr);


  arr.forEach((i) => {
    console.log(`${i}:`, res[i].join('').split('').join(' '));
  })
});
