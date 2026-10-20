import { useState } from "react";

import "../styles/Challenge.css";

/* =========================================================
   HELPER
========================================================= */

function shuffleArray(array) {
  const copied = [...array];

  for (let i = copied.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [copied[i], copied[randomIndex]] = [
      copied[randomIndex],
      copied[i],
    ];
  }

  return copied;
}

/* =========================================================
   DECODE QUESTIONS
========================================================= */

const decodeQuestions = [
  {
    id: 1,
    title: "Strings ending in 1",
    description:
      "Accept all binary strings whose last symbol is 1.",
    hint:
      "Focus on the final symbol of the string. Which state represents that the last symbol was 1?",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 120,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 560,
        y: 180,
        start: false,
        final: true,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q0",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q0",
        to: "q1",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q1",
        to: "q0",
        symbol: "0",
        type: "backward",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "1",
        type: "loop",
      },
    ],
    options: [
      "Strings ending in 1",
      "Strings starting with 1",
      "Strings containing 01",
      "Strings having an even number of 1s",
    ],
    correct: 0,
    explanation:
      "The DFA accepts strings ending in 1 because q1 is the final state and q1 represents that the latest input symbol is 1.",
    examples: [
      ["101", true],
      ["111", true],
      ["1001", true],
      ["100", false],
    ],
  },

  {
    id: 2,
    title: "Strings ending in 0",
    description:
      "Accept all binary strings whose last symbol is 0.",
    hint:
      "Observe which state becomes final when the last input symbol is 0.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 120,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 560,
        y: 180,
        start: false,
        final: true,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q1",
        symbol: "0",
        type: "forward",
      },
      {
        from: "q0",
        to: "q0",
        symbol: "1",
        type: "loop",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q1",
        to: "q0",
        symbol: "1",
        type: "backward",
      },
    ],
    options: [
      "Strings ending in 0",
      "Strings ending in 1",
      "Strings starting with 0",
      "Strings containing 10",
    ],
    correct: 0,
    explanation:
      "The DFA accepts strings ending in 0 because q1 is final and every input 0 moves the machine into q1.",
    examples: [
      ["100", true],
      ["110", true],
      ["101", false],
      ["111", false],
    ],
  },

  {
    id: 3,
    title: "Strings starting with 1",
    description:
      "Accept binary strings whose first symbol is 1.",
    hint:
      "Look at what happens immediately after the first input symbol.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 100,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 350,
        y: 100,
        start: false,
        final: true,
      },
      {
        id: "qd",
        x: 600,
        y: 260,
        start: false,
        final: false,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q1",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q0",
        to: "qd",
        symbol: "0",
        type: "forward",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "0, 1",
        type: "loop",
      },
      {
        from: "qd",
        to: "qd",
        symbol: "0, 1",
        type: "loop",
      },
    ],
    options: [
      "Strings starting with 1",
      "Strings ending in 1",
      "Strings containing 01",
      "Strings with an even number of 1s",
    ],
    correct: 0,
    explanation:
      "If the first symbol is 1, the DFA moves from q0 to the final state q1. If the first symbol is 0, it moves to the trap state qd.",
    examples: [
      ["101", true],
      ["111", true],
      ["011", false],
      ["001", false],
    ],
  },

  {
    id: 4,
    title: "Strings starting with 0",
    description:
      "Accept binary strings whose first symbol is 0.",
    hint:
      "Check the transition taken from the start state on the first symbol.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 100,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 350,
        y: 100,
        start: false,
        final: true,
      },
      {
        id: "qd",
        x: 600,
        y: 260,
        start: false,
        final: false,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q1",
        symbol: "0",
        type: "forward",
      },
      {
        from: "q0",
        to: "qd",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "0, 1",
        type: "loop",
      },
      {
        from: "qd",
        to: "qd",
        symbol: "0, 1",
        type: "loop",
      },
    ],
    options: [
      "Strings starting with 0",
      "Strings ending in 0",
      "Strings containing 10",
      "Strings having an odd number of 0s",
    ],
    correct: 0,
    explanation:
      "The DFA enters final state q1 when the first symbol is 0. Once there, both 0 and 1 keep it in q1.",
    examples: [
      ["001", true],
      ["010", true],
      ["101", false],
      ["111", false],
    ],
  },

  {
    id: 5,
    title: "Even number of 1s",
    description:
      "Accept strings containing an even number of 1s.",
    hint:
      "Every time you read 1, the parity changes. Reading 0 keeps the parity unchanged.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 120,
        y: 180,
        start: true,
        final: true,
      },
      {
        id: "q1",
        x: 560,
        y: 180,
        start: false,
        final: false,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q0",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q0",
        to: "q1",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q1",
        to: "q0",
        symbol: "1",
        type: "backward",
      },
    ],
    options: [
      "Strings having an even number of 1s",
      "Strings having an odd number of 1s",
      "Strings ending in 1",
      "Strings starting with 1",
    ],
    correct: 0,
    explanation:
      "q0 represents an even number of 1s and is final. Each 1 toggles between q0 and q1.",
    examples: [
      ["11", true],
      ["101", true],
      ["1111", true],
      ["1", false],
    ],
  },

  {
    id: 6,
    title: "Odd number of 1s",
    description:
      "Accept strings containing an odd number of 1s.",
    hint:
      "The final state represents odd parity. Each 1 changes the parity.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 120,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 560,
        y: 180,
        start: false,
        final: true,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q0",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q0",
        to: "q1",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q1",
        to: "q0",
        symbol: "1",
        type: "backward",
      },
    ],
    options: [
      "Strings having an odd number of 1s",
      "Strings having an even number of 1s",
      "Strings ending in 0",
      "Strings containing 01",
    ],
    correct: 0,
    explanation:
      "q1 is final and represents an odd number of 1s. Every 1 toggles between the even and odd states.",
    examples: [
      ["1", true],
      ["101", true],
      ["111", true],
      ["11", false],
    ],
  },

  {
    id: 7,
    title: "Contains 01",
    description:
      "Accept strings containing the substring 01.",
    hint:
      "The DFA must remember whether it has seen a 0 followed immediately by 1.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 100,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 350,
        y: 100,
        start: false,
        final: false,
      },
      {
        id: "q2",
        x: 600,
        y: 180,
        start: false,
        final: true,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q1",
        symbol: "0",
        type: "forward",
      },
      {
        from: "q0",
        to: "q0",
        symbol: "1",
        type: "loop",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q1",
        to: "q2",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q2",
        to: "q2",
        symbol: "0, 1",
        type: "loop",
      },
    ],
    options: [
      "Strings containing 01",
      "Strings ending in 01",
      "Strings starting with 01",
      "Strings containing 10",
    ],
    correct: 0,
    explanation:
      "q1 means a 0 has been seen. Reading 1 after q1 moves to final q2, meaning the substring 01 has occurred.",
    examples: [
      ["01", true],
      ["001", true],
      ["1010", true],
      ["111", false],
    ],
  },

  {
    id: 8,
    title: "Contains 10",
    description:
      "Accept strings containing the substring 10.",
    hint:
      "Look for a transition from a state representing a previous 1 to a final state on 0.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 100,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 350,
        y: 100,
        start: false,
        final: false,
      },
      {
        id: "q2",
        x: 600,
        y: 180,
        start: false,
        final: true,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q1",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q0",
        to: "q0",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "1",
        type: "loop",
      },
      {
        from: "q1",
        to: "q2",
        symbol: "0",
        type: "forward",
      },
      {
        from: "q2",
        to: "q2",
        symbol: "0, 1",
        type: "loop",
      },
    ],
    options: [
      "Strings containing 10",
      "Strings containing 01",
      "Strings ending in 10",
      "Strings starting with 10",
    ],
    correct: 0,
    explanation:
      "q1 represents that a 1 has been seen. Reading 0 after q1 moves to final q2, so the substring 10 has occurred.",
    examples: [
      ["10", true],
      ["110", true],
      ["101", true],
      ["111", false],
    ],
  },

  {
    id: 9,
    title: "Contains 11",
    description:
      "Accept strings containing two consecutive 1s.",
    hint:
      "The DFA needs to remember when one 1 has already been seen.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 100,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 350,
        y: 100,
        start: false,
        final: false,
      },
      {
        id: "q2",
        x: 600,
        y: 180,
        start: false,
        final: true,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q0",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q0",
        to: "q1",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q1",
        to: "q0",
        symbol: "0",
        type: "forward",
      },
      {
        from: "q1",
        to: "q2",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q2",
        to: "q2",
        symbol: "0, 1",
        type: "loop",
      },
    ],
    options: [
      "Strings containing 11",
      "Strings ending in 11",
      "Strings containing 01",
      "Strings having exactly two 1s",
    ],
    correct: 0,
    explanation:
      "q1 means one 1 has been seen. Another 1 moves the DFA to final q2, meaning 11 has occurred.",
    examples: [
      ["11", true],
      ["0110", true],
      ["1011", true],
      ["1010", false],
    ],
  },

  {
    id: 10,
    title: "Ends with 00",
    description:
      "Accept binary strings whose last two symbols are 00.",
    hint:
      "The DFA must remember whether the last one or two symbols are zeros.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 100,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 350,
        y: 100,
        start: false,
        final: false,
      },
      {
        id: "q2",
        x: 600,
        y: 180,
        start: false,
        final: true,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q1",
        symbol: "0",
        type: "forward",
      },
      {
        from: "q0",
        to: "q0",
        symbol: "1",
        type: "loop",
      },
      {
        from: "q1",
        to: "q2",
        symbol: "0",
        type: "forward",
      },
      {
        from: "q1",
        to: "q0",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q2",
        to: "q2",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q2",
        to: "q0",
        symbol: "1",
        type: "forward",
      },
    ],
    options: [
      "Strings ending in 00",
      "Strings starting with 00",
      "Strings containing 00",
      "Strings having an even number of 0s",
    ],
    correct: 0,
    explanation:
      "q1 means one trailing 0 has been seen. Another 0 moves to final q2, meaning the string ends with 00.",
    examples: [
      ["00", true],
      ["100", true],
      ["1100", true],
      ["001", false],
    ],
  },
];

/* =========================================================
   FIX QUESTIONS
========================================================= */

const fixQuestions = [
  {
    id: 1,
    title: "Strings ending in 1",
    description:
      "Fix the incorrect transition so the DFA accepts strings ending in 1.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 120,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 560,
        y: 180,
        start: false,
        final: true,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q0",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q0",
        to: "q1",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q1",
        to: "q0",
        symbol: "1",
        type: "backward",
        wrong: true,
        correctTo: "q1",
      },
    ],
    wrongTransition: "q1 --1--> q0",
    correctTransition: "q1 --1--> q1",
    options: ["q0", "q1"],
    explanation:
      "The final state q1 represents that the latest symbol is 1. Therefore, reading another 1 from q1 must keep the DFA in q1.",
    examples: [
      ["1", true],
      ["101", true],
      ["111", true],
      ["100", false],
    ],
  },

  {
    id: 2,
    title: "Strings ending in 0",
    description:
      "Fix the incorrect transition so the DFA accepts strings ending in 0.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 120,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 560,
        y: 180,
        start: false,
        final: true,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q1",
        symbol: "0",
        type: "forward",
      },
      {
        from: "q0",
        to: "q0",
        symbol: "1",
        type: "loop",
      },
      {
        from: "q1",
        to: "q0",
        symbol: "0",
        type: "backward",
        wrong: true,
        correctTo: "q1",
      },
      {
        from: "q1",
        to: "q0",
        symbol: "1",
        type: "backward",
      },
    ],
    wrongTransition: "q1 --0--> q0",
    correctTransition: "q1 --0--> q1",
    options: ["q0", "q1"],
    explanation:
      "Since q1 represents that the latest symbol is 0, another 0 must keep the DFA in final state q1.",
    examples: [
      ["0", true],
      ["100", true],
      ["110", true],
      ["101", false],
    ],
  },

  {
    id: 3,
    title: "Strings starting with 1",
    description:
      "Fix the incorrect transition for strings starting with 1.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 100,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 350,
        y: 100,
        start: false,
        final: true,
      },
      {
        id: "qd",
        x: 600,
        y: 260,
        start: false,
        final: false,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q1",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q0",
        to: "q1",
        symbol: "0",
        type: "forward",
        wrong: true,
        correctTo: "qd",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "0, 1",
        type: "loop",
      },
      {
        from: "qd",
        to: "qd",
        symbol: "0, 1",
        type: "loop",
      },
    ],
    wrongTransition: "q0 --0--> q1",
    correctTransition: "q0 --0--> qd",
    options: ["q0", "q1", "qd"],
    explanation:
      "If the first symbol is 0, the string can never start with 1. Therefore q0 on input 0 must move to the rejecting trap state qd.",
    examples: [
      ["101", true],
      ["111", true],
      ["011", false],
      ["001", false],
    ],
  },

  {
    id: 4,
    title: "Strings starting with 0",
    description:
      "Fix the incorrect transition for strings starting with 0.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 100,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 350,
        y: 100,
        start: false,
        final: true,
      },
      {
        id: "qd",
        x: 600,
        y: 260,
        start: false,
        final: false,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q1",
        symbol: "0",
        type: "forward",
      },
      {
        from: "q0",
        to: "qd",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q1",
        to: "qd",
        symbol: "0, 1",
        type: "loop",
        wrong: true,
        correctTo: "q1",
      },
      {
        from: "qd",
        to: "qd",
        symbol: "0, 1",
        type: "loop",
      },
    ],
    wrongTransition: "q1 --0,1--> qd",
    correctTransition: "q1 --0,1--> q1",
    options: ["q0", "q1", "qd"],
    explanation:
      "Once the first symbol is 0, the string has already satisfied the condition. Therefore q1 must remain final on both 0 and 1.",
    examples: [
      ["0", true],
      ["001", true],
      ["010", true],
      ["101", false],
    ],
  },

  {
    id: 5,
    title: "Even number of 1s",
    description:
      "Fix the transition that breaks the even-number-of-1s DFA.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 120,
        y: 180,
        start: true,
        final: true,
      },
      {
        id: "q1",
        x: 560,
        y: 180,
        start: false,
        final: false,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q0",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q0",
        to: "q1",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "1",
        type: "loop",
        wrong: true,
        correctTo: "q0",
      },
    ],
    wrongTransition: "q1 --1--> q1",
    correctTransition: "q1 --1--> q0",
    options: ["q0", "q1"],
    explanation:
      "Each 1 changes parity. Therefore, after reading a 1 from the odd state q1, the DFA must return to the even state q0.",
    examples: [
      ["", true],
      ["11", true],
      ["101", true],
      ["1", false],
    ],
  },

  {
    id: 6,
    title: "Odd number of 1s",
    description:
      "Fix the transition that breaks the odd-number-of-1s DFA.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 120,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 560,
        y: 180,
        start: false,
        final: true,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q0",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q0",
        to: "q1",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "1",
        type: "loop",
        wrong: true,
        correctTo: "q0",
      },
    ],
    wrongTransition: "q1 --1--> q1",
    correctTransition: "q1 --1--> q0",
    options: ["q0", "q1"],
    explanation:
      "q1 represents an odd number of 1s. Reading another 1 changes the count from odd to even, so the DFA must move to q0.",
    examples: [
      ["1", true],
      ["101", true],
      ["111", true],
      ["11", false],
    ],
  },

  {
    id: 7,
    title: "Contains 01",
    description:
      "Fix the transition that prevents the DFA from detecting 01.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 100,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 350,
        y: 100,
        start: false,
        final: false,
      },
      {
        id: "q2",
        x: 600,
        y: 180,
        start: false,
        final: true,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q1",
        symbol: "0",
        type: "forward",
      },
      {
        from: "q0",
        to: "q0",
        symbol: "1",
        type: "loop",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "1",
        type: "forward",
        wrong: true,
        correctTo: "q2",
      },
      {
        from: "q2",
        to: "q2",
        symbol: "0, 1",
        type: "loop",
      },
    ],
    wrongTransition: "q1 --1--> q1",
    correctTransition: "q1 --1--> q2",
    options: ["q0", "q1", "q2"],
    explanation:
      "q1 means that a 0 has just been seen. If the next symbol is 1, the substring 01 is complete, so the DFA must move to final q2.",
    examples: [
      ["01", true],
      ["001", true],
      ["1010", true],
      ["111", false],
    ],
  },

  {
    id: 8,
    title: "Contains 10",
    description:
      "Fix the transition that prevents the DFA from detecting 10.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 100,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 350,
        y: 100,
        start: false,
        final: false,
      },
      {
        id: "q2",
        x: 600,
        y: 180,
        start: false,
        final: true,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q1",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q0",
        to: "q0",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "1",
        type: "loop",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "0",
        type: "forward",
        wrong: true,
        correctTo: "q2",
      },
      {
        from: "q2",
        to: "q2",
        symbol: "0, 1",
        type: "loop",
      },
    ],
    wrongTransition: "q1 --0--> q1",
    correctTransition: "q1 --0--> q2",
    options: ["q0", "q1", "q2"],
    explanation:
      "q1 means that a 1 has been seen. Reading 0 completes the substring 10, so the DFA must move to final q2.",
    examples: [
      ["10", true],
      ["110", true],
      ["101", true],
      ["111", false],
    ],
  },

  {
    id: 9,
    title: "Contains 11",
    description:
      "Fix the transition that prevents the DFA from detecting 11.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 100,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 350,
        y: 100,
        start: false,
        final: false,
      },
      {
        id: "q2",
        x: 600,
        y: 180,
        start: false,
        final: true,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q0",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q0",
        to: "q1",
        symbol: "1",
        type: "forward",
      },
      {
        from: "q1",
        to: "q0",
        symbol: "0",
        type: "forward",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "1",
        type: "forward",
        wrong: true,
        correctTo: "q2",
      },
      {
        from: "q2",
        to: "q2",
        symbol: "0, 1",
        type: "loop",
      },
    ],
    wrongTransition: "q1 --1--> q1",
    correctTransition: "q1 --1--> q2",
    options: ["q0", "q1", "q2"],
    explanation:
      "q1 means one consecutive 1 has been seen. Reading another 1 completes 11, so the DFA must enter final q2.",
    examples: [
      ["11", true],
      ["0110", true],
      ["1011", true],
      ["1010", false],
    ],
  },

  {
    id: 10,
    title: "Ends with 00",
    description:
      "Fix the transition that breaks the DFA for strings ending in 00.",
    alphabet: "{0, 1}",
    states: [
      {
        id: "q0",
        x: 100,
        y: 180,
        start: true,
        final: false,
      },
      {
        id: "q1",
        x: 350,
        y: 100,
        start: false,
        final: false,
      },
      {
        id: "q2",
        x: 600,
        y: 180,
        start: false,
        final: true,
      },
    ],
    transitions: [
      {
        from: "q0",
        to: "q1",
        symbol: "0",
        type: "forward",
      },
      {
        from: "q0",
        to: "q0",
        symbol: "1",
        type: "loop",
      },
      {
        from: "q1",
        to: "q2",
        symbol: "0",
        type: "forward",
      },
      {
        from: "q1",
        to: "q1",
        symbol: "1",
        type: "forward",
        wrong: true,
        correctTo: "q0",
      },
      {
        from: "q2",
        to: "q2",
        symbol: "0",
        type: "loop",
      },
      {
        from: "q2",
        to: "q0",
        symbol: "1",
        type: "forward",
      },
    ],
    wrongTransition: "q1 --1--> q1",
    correctTransition: "q1 --1--> q0",
    options: ["q0", "q1", "q2"],
    explanation:
      "q1 means that one trailing 0 has been seen. If a 1 appears, the trailing 0 is broken, so the DFA must return to q0.",
    examples: [
      ["00", true],
      ["100", true],
      ["1100", true],
      ["001", false],
    ],
  },
];

/* =========================================================
   BUILD QUESTIONS - 10
========================================================= */

const buildQuestions = [
  {
    id: 1,
    title: "Strings ending in 1",
    requirement:
      "Build a DFA that accepts all binary strings whose last symbol is 1.",
    alphabet: "{0, 1}",
    alphabetSymbols: ["0", "1"],
    states: ["q0", "q1"],
    startState: "q0",
    finalStates: ["q1"],
    transitions: {
      q0_0: "q0",
      q0_1: "q1",
      q1_0: "q0",
      q1_1: "q1",
    },
    explanation:
      "q0 represents that the latest symbol is 0, while q1 represents that the latest symbol is 1. Since strings must end in 1, q1 is final.",
    examples: [
      ["1", true],
      ["101", true],
      ["111", true],
      ["100", false],
    ],
  },

  {
    id: 2,
    title: "Strings ending in 0",
    requirement:
      "Build a DFA that accepts all binary strings whose last symbol is 0.",
    alphabet: "{0, 1}",
    alphabetSymbols: ["0", "1"],
    states: ["q0", "q1"],
    startState: "q0",
    finalStates: ["q1"],
    transitions: {
      q0_0: "q1",
      q0_1: "q0",
      q1_0: "q1",
      q1_1: "q0",
    },
    explanation:
      "q1 represents that the latest symbol is 0, so q1 is the final state. Reading 0 keeps the machine in q1, while 1 returns it to q0.",
    examples: [
      ["0", true],
      ["100", true],
      ["110", true],
      ["101", false],
    ],
  },

  {
    id: 3,
    title: "Even number of 1s",
    requirement:
      "Build a DFA that accepts binary strings containing an even number of 1s.",
    alphabet: "{0, 1}",
    alphabetSymbols: ["0", "1"],
    states: ["q0", "q1"],
    startState: "q0",
    finalStates: ["q0"],
    transitions: {
      q0_0: "q0",
      q0_1: "q1",
      q1_0: "q1",
      q1_1: "q0",
    },
    explanation:
      "q0 represents an even number of 1s and q1 represents an odd number. Every 1 changes the parity, while 0 keeps it unchanged.",
    examples: [
      ["", true],
      ["11", true],
      ["101", true],
      ["1", false],
    ],
  },

  {
    id: 4,
    title: "Contains 01",
    requirement:
      "Build a DFA that accepts all binary strings containing the substring 01.",
    alphabet: "{0, 1}",
    alphabetSymbols: ["0", "1"],
    states: ["q0", "q1", "q2"],
    startState: "q0",
    finalStates: ["q2"],
    transitions: {
      q0_0: "q1",
      q0_1: "q0",
      q1_0: "q1",
      q1_1: "q2",
      q2_0: "q2",
      q2_1: "q2",
    },
    explanation:
      "q0 means the substring has not started, q1 means a 0 has been seen, and q2 means 01 has been detected. Once q2 is reached, the string remains accepted.",
    examples: [
      ["01", true],
      ["001", true],
      ["1010", true],
      ["111", false],
    ],
  },

  {
    id: 5,
    title: "Contains 10",
    requirement:
      "Build a DFA that accepts all binary strings containing the substring 10.",
    alphabet: "{0, 1}",
    alphabetSymbols: ["0", "1"],
    states: ["q0", "q1", "q2"],
    startState: "q0",
    finalStates: ["q2"],
    transitions: {
      q0_0: "q0",
      q0_1: "q1",
      q1_0: "q2",
      q1_1: "q1",
      q2_0: "q2",
      q2_1: "q2",
    },
    explanation:
      "q1 means a 1 has been seen. Reading 0 after q1 completes the substring 10 and moves to final q2.",
    examples: [
      ["10", true],
      ["110", true],
      ["101", true],
      ["111", false],
    ],
  },

  {
    id: 6,
    title: "Strings starting with 1",
    requirement:
      "Build a DFA that accepts all binary strings that start with 1.",
    alphabet: "{0, 1}",
    alphabetSymbols: ["0", "1"],
    states: ["q0", "q1", "q2"],
    startState: "q0",
    finalStates: ["q1"],
    transitions: {
      q0_0: "q2",
      q0_1: "q1",
      q1_0: "q1",
      q1_1: "q1",
      q2_0: "q2",
      q2_1: "q2",
    },
    explanation:
      "The first input decides the result. If the first symbol is 1, the DFA enters final state q1. If it is 0, it enters trap state q2.",
    examples: [
      ["1", true],
      ["101", true],
      ["111", true],
      ["011", false],
    ],
  },

  {
    id: 7,
    title: "Strings starting with 0",
    requirement:
      "Build a DFA that accepts all binary strings that start with 0.",
    alphabet: "{0, 1}",
    alphabetSymbols: ["0", "1"],
    states: ["q0", "q1", "q2"],
    startState: "q0",
    finalStates: ["q1"],
    transitions: {
      q0_0: "q1",
      q0_1: "q2",
      q1_0: "q1",
      q1_1: "q1",
      q2_0: "q2",
      q2_1: "q2",
    },
    explanation:
      "If the first symbol is 0, the DFA enters final state q1. If the first symbol is 1, it enters trap state q2.",
    examples: [
      ["0", true],
      ["001", true],
      ["010", true],
      ["101", false],
    ],
  },

  {
    id: 8,
    title: "Even number of 0s",
    requirement:
      "Build a DFA that accepts binary strings containing an even number of 0s.",
    alphabet: "{0, 1}",
    alphabetSymbols: ["0", "1"],
    states: ["q0", "q1"],
    startState: "q0",
    finalStates: ["q0"],
    transitions: {
      q0_0: "q1",
      q0_1: "q0",
      q1_0: "q0",
      q1_1: "q1",
    },
    explanation:
      "q0 represents an even number of 0s and q1 represents an odd number of 0s. Therefore q0 is both start and final.",
    examples: [
      ["", true],
      ["11", true],
      ["00", true],
      ["0", false],
    ],
  },

  {
    id: 9,
    title: "Contains 11",
    requirement:
      "Build a DFA that accepts binary strings containing the substring 11.",
    alphabet: "{0, 1}",
    alphabetSymbols: ["0", "1"],
    states: ["q0", "q1", "q2"],
    startState: "q0",
    finalStates: ["q2"],
    transitions: {
      q0_0: "q0",
      q0_1: "q1",
      q1_0: "q0",
      q1_1: "q2",
      q2_0: "q2",
      q2_1: "q2",
    },
    explanation:
      "q1 means one 1 has been seen. Reading another 1 completes the pattern 11 and moves to final state q2.",
    examples: [
      ["11", true],
      ["0110", true],
      ["1011", true],
      ["1010", false],
    ],
  },

  {
    id: 10,
    title: "Contains 00",
    requirement:
      "Build a DFA that accepts binary strings containing the substring 00.",
    alphabet: "{0, 1}",
    alphabetSymbols: ["0", "1"],
    states: ["q0", "q1", "q2"],
    startState: "q0",
    finalStates: ["q2"],
    transitions: {
      q0_0: "q1",
      q0_1: "q0",
      q1_0: "q2",
      q1_1: "q0",
      q2_0: "q2",
      q2_1: "q2",
    },
    explanation:
      "q1 means one 0 has been seen. Reading another 0 completes the pattern 00 and moves to final state q2.",
    examples: [
      ["00", true],
      ["100", true],
      ["1100", true],
      ["001", false],
    ],
  },
];

/* =========================================================
   DFA DIAGRAM
========================================================= */

function DFADiagram({ question }) {
  const stateRadius = 46;

  const getState = (id) =>
    question.states.find((state) => state.id === id);

  const getPathForTransition = (transition) => {
    const from = getState(transition.from);
    const to = getState(transition.to);

    if (!from || !to) {
      return "";
    }

    /* -------------------------
       SELF LOOP
    ------------------------- */

    if (transition.type === "loop") {
      return `
        M ${from.x - 22} ${from.y - 36}
        C ${from.x - 85} ${from.y - 105},
          ${from.x + 70} ${from.y - 125},
          ${from.x + 35} ${from.y - 38}
      `;
    }

    const dx = to.x - from.x;
    const dy = to.y - from.y;

    const distance = Math.sqrt(
      dx * dx + dy * dy
    );

    if (distance === 0) {
      return "";
    }

    const unitX = dx / distance;
    const unitY = dy / distance;

    const startX =
      from.x + unitX * stateRadius;

    const startY =
      from.y + unitY * stateRadius;

    const endX =
      to.x - unitX * stateRadius;

    const endY =
      to.y - unitY * stateRadius;

    /* -------------------------
       BACKWARD CURVE
    ------------------------- */

    if (transition.type === "backward") {
      const midX =
        (startX + endX) / 2;

      const midY =
        (startY + endY) / 2;

      const perpendicularX = -unitY;
      const perpendicularY = unitX;

      const curve = 75;

      const controlX =
        midX +
        perpendicularX * curve;

      const controlY =
        midY +
        perpendicularY * curve;

      return `
        M ${startX} ${startY}
        Q ${controlX} ${controlY}
          ${endX} ${endY}
      `;
    }

    /* -------------------------
       NORMAL FORWARD LINE
    ------------------------- */

    return `
      M ${startX} ${startY}
      L ${endX} ${endY}
    `;
  };

  const getLabelPosition = (transition) => {
    const from = getState(transition.from);
    const to = getState(transition.to);

    if (!from || !to) {
      return {
        x: 0,
        y: 0,
      };
    }

    if (transition.type === "loop") {
      return {
        x: from.x,
        y: from.y - 92,
      };
    }

    const midX =
      (from.x + to.x) / 2;

    const midY =
      (from.y + to.y) / 2;

    if (transition.type === "backward") {
      return {
        x: midX,
        y: midY + 68,
      };
    }

    return {
      x: midX,
      y: midY - 22,
    };
  };

  return (
    <div className="dfa-machine">
      <svg
        className="dfa-svg"
        viewBox="0 0 700 360"
        role="img"
        aria-label="DFA diagram"
      >
        <defs>
          <marker
            id={`arrow-${question.id}`}
            viewBox="0 0 10 10"
            refX="8.5"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
              fill="#64748b"
            />
          </marker>
        </defs>

        {/* START ARROW */}

        {question.states
          .filter((state) => state.start)
          .map((state) => (
            <path
              key={`start-${state.id}`}
              d={`
                M ${state.x - 95} ${state.y}
                L ${state.x - stateRadius} ${state.y}
              `}
              stroke="#2563eb"
              strokeWidth="4"
              fill="none"
              markerEnd={`url(#arrow-${question.id})`}
            />
          ))}

        {/* TRANSITIONS */}

        {question.transitions.map(
          (transition, index) => {
            const label =
              getLabelPosition(
                transition
              );

            return (
              <g
                key={`${transition.from}-${transition.to}-${transition.symbol}-${index}`}
              >
                <path
                  d={getPathForTransition(
                    transition
                  )}
                  stroke={
                    transition.wrong
                      ? "#dc2626"
                      : "#64748b"
                  }
                  strokeWidth={
                    transition.wrong
                      ? "4"
                      : "3"
                  }
                  fill="none"
                  strokeLinecap="round"
                  markerEnd={`url(#arrow-${question.id})`}
                />

                {/* LABEL */}

                <g
                  transform={`translate(${label.x}, ${label.y})`}
                >
                  <rect
                    x="-25"
                    y="-17"
                    width="50"
                    height="34"
                    rx="10"
                    fill="white"
                    stroke={
                      transition.wrong
                        ? "#fecaca"
                        : "#e2e8f0"
                    }
                  />

                  <text
                    x="0"
                    y="6"
                    textAnchor="middle"
                    fontSize="16"
                    fontWeight="800"
                    fill={
                      transition.wrong
                        ? "#dc2626"
                        : "#2563eb"
                    }
                  >
                    {transition.symbol}
                  </text>
                </g>
              </g>
            );
          }
        )}

        {/* STATES */}

        {question.states.map((state) => (
          <g key={state.id}>
            {/* FINAL OUTER CIRCLE */}

            {state.final && (
              <circle
                cx={state.x}
                cy={state.y}
                r={stateRadius + 8}
                fill="white"
                stroke="#16a34a"
                strokeWidth="4"
              />
            )}

            {/* STATE */}

            <circle
              cx={state.x}
              cy={state.y}
              r={stateRadius}
              fill="white"
              stroke={
                state.final
                  ? "#16a34a"
                  : "#2563eb"
              }
              strokeWidth="4"
            />

            {/* STATE NAME */}

            <text
              x={state.x}
              y={state.y + 7}
              textAnchor="middle"
              fontSize="25"
              fontWeight="800"
              fill="#0f172a"
            >
              {state.id}
            </text>

            {/* START */}

            {state.start && (
              <text
                x={state.x}
                y={state.y + 31}
                textAnchor="middle"
                fontSize="10"
                fontWeight="800"
                letterSpacing="1.2"
                fill="#64748b"
              >
                START
              </text>
            )}

            {/* FINAL */}

            {state.final && (
              <text
                x={state.x}
                y={state.y + 31}
                textAnchor="middle"
                fontSize="10"
                fontWeight="800"
                letterSpacing="1.2"
                fill="#64748b"
              >
                FINAL
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function Challenge() {
  const [selectedMode, setSelectedMode] =
    useState(null);

  /* =====================================================
     DECODE STATE
  ===================================================== */

  const [decodeQuestionsPool] = useState(() =>
    shuffleArray(decodeQuestions)
  );

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState("");

  const [
    answerSubmitted,
    setAnswerSubmitted,
  ] = useState(false);

  /* =====================================================
     FIX STATE
  ===================================================== */

  const [fixQuestionsPool] = useState(() =>
    shuffleArray(fixQuestions)
  );

  const [
    fixQuestionIndex,
    setFixQuestionIndex,
  ] = useState(0);

  const [
    selectedFixAnswer,
    setSelectedFixAnswer,
  ] = useState("");

  const [
    fixSubmitted,
    setFixSubmitted,
  ] = useState(false);

  /* =====================================================
     BUILD STATE
  ===================================================== */

  const [buildQuestionsPool] = useState(() =>
    shuffleArray(buildQuestions)
  );

  const [
    buildQuestionIndex,
    setBuildQuestionIndex,
  ] = useState(0);

  const [
    buildStartState,
    setBuildStartState,
  ] = useState("");

  const [
    buildFinalState,
    setBuildFinalState,
  ] = useState("");

  const [
    buildTransitions,
    setBuildTransitions,
  ] = useState({});

  const [
    buildResult,
    setBuildResult,
  ] = useState("");

  /* =====================================================
     FINAL SCORE STATE
  ===================================================== */

  const [decodeScore, setDecodeScore] = useState(0);
  const [decodeAttemptedIds, setDecodeAttemptedIds] = useState(() => new Set());
  const [decodeComplete, setDecodeComplete] = useState(false);

  const [fixScore, setFixScore] = useState(0);
  const [fixAttemptedIds, setFixAttemptedIds] = useState(() => new Set());
  const [fixComplete, setFixComplete] = useState(false);

  const [buildScore, setBuildScore] = useState(0);
  const [buildAttemptedIds, setBuildAttemptedIds] = useState(() => new Set());
  const [buildComplete, setBuildComplete] = useState(false);

  /* =====================================================
     CURRENT QUESTIONS
  ===================================================== */

  const currentQuestion =
    decodeQuestionsPool[
      currentQuestionIndex
    ];

  const currentFixQuestion =
    fixQuestionsPool[
      fixQuestionIndex
    ];

  const currentBuildQuestion =
    buildQuestionsPool[
      buildQuestionIndex
    ];

  /* =====================================================
     ANSWER CHECK
  ===================================================== */

  const isCorrect =
    selectedAnswer ===
    String(currentQuestion.correct);

  const isFixCorrect =
    selectedFixAnswer ===
    currentFixQuestion?.transitions.find(
      (transition) =>
        transition.wrong
    )?.correctTo;

  /* =====================================================
     CHALLENGE MODES
  ===================================================== */

  const challenges = [
    {
      id: "decode",
      icon: "🔍",
      label: "CHALLENGE 01",
      title: "Decode the DFA",
      description:
        "Study a DFA and determine which type of strings it accepts.",
      button: "Start Decoding",
    },

    {
      id: "fix",
      icon: "🔧",
      label: "CHALLENGE 02",
      title: "Fix the DFA",
      description:
        "Find the incorrect transition and correct the DFA to make it work.",
      button: "Fix the DFA",
    },

    {
      id: "build",
      icon: "🏗️",
      label: "CHALLENGE 03",
      title: "Build the Answer",
      description:
        "Read an automata requirement and construct the correct DFA solution.",
      button: "Build Answer",
    },
  ];

  /* =====================================================
     BUILD HELPERS
  ===================================================== */

  const resetBuildQuestion = () => {
    setBuildStartState("");
    setBuildFinalState("");
    setBuildTransitions({});
    setBuildResult("");
  };

  const handleBuildTransitionChange = (
    state,
    symbol,
    value
  ) => {
    setBuildTransitions(
      (previous) => ({
        ...previous,
        [`${state}_${symbol}`]:
          value,
      })
    );

    setBuildResult("");
  };

  const handleBuildStartChange = (
    value
  ) => {
    setBuildStartState(value);
    setBuildResult("");
  };

  const handleBuildFinalChange = (
    value
  ) => {
    setBuildFinalState(value);
    setBuildResult("");
  };

  /* =====================================================
     CHECK BUILD ANSWER
  ===================================================== */

  const handleCheckBuild = () => {
    if (
      !buildStartState ||
      !buildFinalState
    ) {
      setBuildResult("incomplete");
      return;
    }

    const requiredTransitions =
      currentBuildQuestion.states.flatMap(
        (state) =>
          currentBuildQuestion.alphabetSymbols.map(
            (symbol) => `${state}_${symbol}`
          )
      );

    const hasMissingTransition =
      requiredTransitions.some(
        (key) => !buildTransitions[key]
      );

    if (hasMissingTransition) {
      setBuildResult("incomplete");
      return;
    }

    const startCorrect =
      buildStartState ===
      currentBuildQuestion.startState;

    const finalCorrect =
      buildFinalState ===
      currentBuildQuestion.finalStates[0];

    const transitionsCorrect =
      requiredTransitions.every(
        (key) =>
          buildTransitions[key] ===
          currentBuildQuestion.transitions[key]
      );

    const isBuildCorrect =
      startCorrect &&
      finalCorrect &&
      transitionsCorrect;

    setBuildResult(
      isBuildCorrect ? "correct" : "wrong"
    );

    if (!buildAttemptedIds.has(currentBuildQuestion.id)) {
      const nextAttemptedIds = new Set(buildAttemptedIds);
      nextAttemptedIds.add(currentBuildQuestion.id);

      setBuildAttemptedIds(nextAttemptedIds);

      if (isBuildCorrect) {
        setBuildScore((previousScore) => previousScore + 1);
      }

      if (nextAttemptedIds.size >= buildQuestionsPool.length) {
        setBuildComplete(true);
      }
    }
  };

  /* =====================================================
     NEXT BUILD QUESTION
  ===================================================== */

  const handleNextBuildQuestion = () => {
    if (buildComplete) {
      return;
    }

    const nextUnansweredIndex = buildQuestionsPool.findIndex(
      (question, index) =>
        index !== buildQuestionIndex &&
        !buildAttemptedIds.has(question.id)
    );

    setBuildQuestionIndex(
      nextUnansweredIndex === -1
        ? (buildQuestionIndex + 1) % buildQuestionsPool.length
        : nextUnansweredIndex
    );

    resetBuildQuestion();
  };

  /* =====================================================
     TRY BUILD AGAIN
  ===================================================== */

  const handleBuildTryAgain = () => {
    resetBuildQuestion();
  };

  /* =====================================================
     RANDOM BUILD QUESTION
  ===================================================== */

  const handleRandomBuildQuestion = () => {
    if (buildComplete) {
      return;
    }

    const unansweredIndexes = buildQuestionsPool
      .map((question, index) => ({ question, index }))
      .filter(({ question }) => !buildAttemptedIds.has(question.id))
      .map(({ index }) => index);

    if (unansweredIndexes.length === 0) {
      return;
    }

    const randomPosition = Math.floor(
      Math.random() * unansweredIndexes.length
    );

    setBuildQuestionIndex(unansweredIndexes[randomPosition]);
    resetBuildQuestion();
  };

  /* =====================================================
     SELECT MODE
  ===================================================== */

  const handleModeSelect = (
    mode
  ) => {
    setSelectedMode(mode);

    setSelectedAnswer("");
    setAnswerSubmitted(false);

    setSelectedFixAnswer("");
    setFixSubmitted(false);

    resetBuildQuestion();

    setDecodeScore(0);
    setDecodeAttemptedIds(new Set());
    setDecodeComplete(false);

    setFixScore(0);
    setFixAttemptedIds(new Set());
    setFixComplete(false);

    setBuildScore(0);
    setBuildAttemptedIds(new Set());
    setBuildComplete(false);

    if (mode === "decode") {
      setCurrentQuestionIndex(
        Math.floor(
          Math.random() *
            decodeQuestionsPool.length
        )
      );
    }

    if (mode === "fix") {
      setFixQuestionIndex(
        Math.floor(
          Math.random() *
            fixQuestionsPool.length
        )
      );
    }

    if (mode === "build") {
      setBuildQuestionIndex(
        Math.floor(
          Math.random() *
            buildQuestionsPool.length
        )
      );
    }
  };

  /* =====================================================
     DECODE
  ===================================================== */

  const handleSubmit = () => {
    if (!selectedAnswer) {
      return;
    }

    setAnswerSubmitted(true);

    if (!decodeAttemptedIds.has(currentQuestion.id)) {
      const nextAttemptedIds = new Set(decodeAttemptedIds);
      nextAttemptedIds.add(currentQuestion.id);

      setDecodeAttemptedIds(nextAttemptedIds);

      if (isCorrect) {
        setDecodeScore((previousScore) => previousScore + 1);
      }

      if (nextAttemptedIds.size >= decodeQuestionsPool.length) {
        setDecodeComplete(true);
      }
    }
  };

  const handleNextQuestion = () => {
    if (decodeComplete) {
      return;
    }

    const nextUnansweredIndex = decodeQuestionsPool.findIndex(
      (question, index) =>
        index !== currentQuestionIndex &&
        !decodeAttemptedIds.has(question.id)
    );

    setSelectedAnswer("");
    setAnswerSubmitted(false);

    setCurrentQuestionIndex(
      nextUnansweredIndex === -1
        ? (currentQuestionIndex + 1) % decodeQuestionsPool.length
        : nextUnansweredIndex
    );
  };

  const handleResetQuestion = () => {
    setSelectedAnswer("");
    setAnswerSubmitted(false);
  };

  const handleRandomQuestion = () => {
    if (decodeComplete) {
      return;
    }

    const unansweredIndexes = decodeQuestionsPool
      .map((question, index) => ({ question, index }))
      .filter(({ question }) => !decodeAttemptedIds.has(question.id))
      .map(({ index }) => index);

    if (unansweredIndexes.length === 0) {
      return;
    }

    const randomPosition = Math.floor(
      Math.random() * unansweredIndexes.length
    );

    setCurrentQuestionIndex(unansweredIndexes[randomPosition]);
    setSelectedAnswer("");
    setAnswerSubmitted(false);
  };

  /* =====================================================
     FIX
  ===================================================== */

  const handleFixSubmit = () => {
    if (!selectedFixAnswer) {
      return;
    }

    setFixSubmitted(true);

    if (!fixAttemptedIds.has(currentFixQuestion.id)) {
      const nextAttemptedIds = new Set(fixAttemptedIds);
      nextAttemptedIds.add(currentFixQuestion.id);

      setFixAttemptedIds(nextAttemptedIds);

      if (isFixCorrect) {
        setFixScore((previousScore) => previousScore + 1);
      }

      if (nextAttemptedIds.size >= fixQuestionsPool.length) {
        setFixComplete(true);
      }
    }
  };

  const handleNextFixQuestion = () => {
    if (fixComplete) {
      return;
    }

    const nextUnansweredIndex = fixQuestionsPool.findIndex(
      (question, index) =>
        index !== fixQuestionIndex &&
        !fixAttemptedIds.has(question.id)
    );

    setSelectedFixAnswer("");
    setFixSubmitted(false);

    setFixQuestionIndex(
      nextUnansweredIndex === -1
        ? (fixQuestionIndex + 1) % fixQuestionsPool.length
        : nextUnansweredIndex
    );
  };

  const handleFixTryAgain = () => {
    setSelectedFixAnswer("");
    setFixSubmitted(false);
  };

  const handleRandomFixQuestion = () => {
    if (fixComplete) {
      return;
    }

    const unansweredIndexes = fixQuestionsPool
      .map((question, index) => ({ question, index }))
      .filter(({ question }) => !fixAttemptedIds.has(question.id))
      .map(({ index }) => index);

    if (unansweredIndexes.length === 0) {
      return;
    }

    const randomPosition = Math.floor(
      Math.random() * unansweredIndexes.length
    );

    setFixQuestionIndex(unansweredIndexes[randomPosition]);
    setSelectedFixAnswer("");
    setFixSubmitted(false);
  };

  /* =====================================================
     RESTART CHALLENGES
  ===================================================== */

  const handleRestartDecodeChallenge = () => {
    setDecodeScore(0);
    setDecodeAttemptedIds(new Set());
    setDecodeComplete(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setAnswerSubmitted(false);
  };

  const handleRestartFixChallenge = () => {
    setFixScore(0);
    setFixAttemptedIds(new Set());
    setFixComplete(false);
    setFixQuestionIndex(0);
    setSelectedFixAnswer("");
    setFixSubmitted(false);
  };

  const handleRestartBuildChallenge = () => {
    setBuildScore(0);
    setBuildAttemptedIds(new Set());
    setBuildComplete(false);
    setBuildQuestionIndex(0);
    resetBuildQuestion();
  };

  /* =====================================================
     BACK
  ===================================================== */

  const handleBack = () => {
    setSelectedMode(null);

    setSelectedAnswer("");
    setAnswerSubmitted(false);

    setSelectedFixAnswer("");
    setFixSubmitted(false);

    setDecodeScore(0);
    setDecodeAttemptedIds(new Set());
    setDecodeComplete(false);

    setFixScore(0);
    setFixAttemptedIds(new Set());
    setFixComplete(false);

    setBuildScore(0);
    setBuildAttemptedIds(new Set());
    setBuildComplete(false);

    resetBuildQuestion();
  };

  /* =====================================================
     FINAL SCORE RESULT
  ===================================================== */

  const renderFinalScore = (
    title,
    score,
    total,
    onTryAgain
  ) => {
    const percentage = Math.round((score / total) * 100);
    const wellDone = percentage >= 70;

    return (
      <div className="answer-result result-correct" style={{ textAlign: "center" }}>
        <div className="result-title">
          {wellDone ? "🎉 Well Done!" : "💪 Keep Practicing!"}
        </div>

        <h3 style={{ margin: "12px 0 6px", color: "#0f172a", fontSize: "28px" }}>
          {title}
        </h3>

        <p style={{ fontSize: "18px", fontWeight: "800", color: "#2563eb" }}>
          You scored {score} out of {total}
        </p>

        <p style={{ fontSize: "16px", fontWeight: "700" }}>
          Score: {percentage}%
        </p>

        <p>
          {wellDone
            ? "Great work! You have a good understanding of these DFA concepts."
            : "You need more practice. Don't worry, you can do it! Keep learning and try again."}
        </p>

        <div className="result-actions">
          <button
            type="button"
            className="try-again-button"
            onClick={onTryAgain}
          >
            Try Again 🔄
          </button>

          <button
            type="button"
            className="try-again-button"
            onClick={handleBack}
          >
            Back to Challenges
          </button>
        </div>
      </div>
    );
  };

  /* =====================================================
     BUILD RESULT
  ===================================================== */

  const renderBuildResult = () => {
    if (buildComplete) {
      return renderFinalScore(
        "Build the DFA Complete",
        buildScore,
        buildQuestionsPool.length,
        handleRestartBuildChallenge
      );
    }

    if (!buildResult) {
      return null;
    }

    /* -------------------------
       INCOMPLETE
    ------------------------- */

    if (
      buildResult ===
      "incomplete"
    ) {
      return (
        <div className="answer-result result-wrong">
          <div className="result-title">
            ⚠ Complete the DFA
          </div>

          <p>
            Please select the start
            state, final state, and
            every required transition
            before checking your DFA.
          </p>

          <div className="result-actions">
            <button
              type="button"
              className="try-again-button"
              onClick={
                handleBuildTryAgain
              }
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    /* -------------------------
       CORRECT
    ------------------------- */

    if (
      buildResult ===
      "correct"
    ) {
      return (
        <div className="answer-result result-correct">
          <div className="result-title">
            ✓ DFA Built Correctly!
          </div>

          <p>
            {
              currentBuildQuestion.explanation
            }
          </p>

          <div className="example-box">
            <strong>
              Correct DFA:
            </strong>

            <span>
              Start State:{" "}
              {
                currentBuildQuestion.startState
              }
            </span>

            <span>
              Final State:{" "}
              {
                currentBuildQuestion
                  .finalStates
                  .join(", ")
              }
            </span>

            {currentBuildQuestion.states.map(
              (state) =>
                currentBuildQuestion.alphabetSymbols.map(
                  (symbol) => (
                    <span
                      key={`${state}_${symbol}`}
                    >
                      {state} +{" "}
                      {symbol} →{" "}
                      {
                        currentBuildQuestion
                          .transitions[
                          `${state}_${symbol}`
                        ]
                      }
                    </span>
                  )
                )
            )}
          </div>

          <div className="example-box">
            <strong>
              Test Examples:
            </strong>

            {currentBuildQuestion.examples.map(
              ([example, accepted]) => (
                <span
                  key={`${example}-${accepted}`}
                >
                  {example || "ε"}{" "}
                  {accepted
                    ? "✓"
                    : "✗"}
                </span>
              )
            )}
          </div>

          <div className="result-actions">
            <button
              type="button"
              className="try-again-button"
              onClick={
                handleBuildTryAgain
              }
            >
              Try Again
            </button>

            <button
              type="button"
              className="try-again-button"
              onClick={
                handleNextBuildQuestion
              }
            >
              Next Challenge →
            </button>
          </div>
        </div>
      );
    }

    /* -------------------------
       WRONG
    ------------------------- */

    return (
      <div className="answer-result result-wrong">
        <div className="result-title">
          ✗ DFA Needs Correction
        </div>

        <p>
          Some of your states or
          transitions do not match
          the required language.
          Check the correct DFA below.
        </p>

        <div className="example-box">
          <strong>
            Correct Answer:
          </strong>

          <span>
            Start State:{" "}
            {
              currentBuildQuestion.startState
            }
          </span>

          <span>
            Final State:{" "}
            {
              currentBuildQuestion
                .finalStates
                .join(", ")
            }
          </span>

          {currentBuildQuestion.states.map(
            (state) =>
              currentBuildQuestion.alphabetSymbols.map(
                (symbol) => (
                  <span
                    key={`${state}_${symbol}`}
                  >
                    {state} +{" "}
                    {symbol} →{" "}
                    {
                      currentBuildQuestion
                        .transitions[
                        `${state}_${symbol}`
                      ]
                    }
                  </span>
                )
              )
          )}
        </div>

        <div className="example-box">
          <strong>
            Explanation:
          </strong>

          <span>
            {
              currentBuildQuestion.explanation
            }
          </span>
        </div>

        <div className="result-actions">
          <button
            type="button"
            className="try-again-button"
            onClick={
              handleBuildTryAgain
            }
          >
            Try Again
          </button>

          <button
            type="button"
            className="try-again-button"
            onClick={
              handleNextBuildQuestion
            }
          >
            Next Challenge →
          </button>
        </div>
      </div>
    );
  };

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <main className="challenge-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="challenge-hero">
        <div className="challenge-badge">
          AUTOMATA CHALLENGE
        </div>

        <h1>
          Learn While
          <span>
            {" "}
            Solving Questions
          </span>
        </h1>

        <p>
          Test your automata knowledge
          through interactive challenges.
          Decode a DFA, fix incorrect
          transitions, and build the
          correct answer.
        </p>
      </section>

      {/* =================================================
          MODE SELECTION
      ================================================= */}

      {!selectedMode && (
        <section className="challenge-modes">

          <div className="challenge-section-heading">
            <p>
              CHOOSE YOUR CHALLENGE
            </p>

            <h2>
              How do you want to
              <span>
                {" "}
                learn?
              </span>
            </h2>

            <span>
              Pick a challenge and put
              your automata knowledge
              into practice.
            </span>
          </div>

          <div className="challenge-grid">

            {challenges.map(
              (challenge) => (
                <article
                  key={
                    challenge.id
                  }
                  className="challenge-card"
                >

                  <div className="challenge-card-top">

                    <span className="challenge-number">
                      {
                        challenge.label
                      }
                    </span>

                    <div className="challenge-icon">
                      {
                        challenge.icon
                      }
                    </div>

                  </div>

                  <h3>
                    {
                      challenge.title
                    }
                  </h3>

                  <p>
                    {
                      challenge.description
                    }
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleModeSelect(
                        challenge.id
                      )
                    }
                    className="challenge-button"
                  >
                    {
                      challenge.button
                    }
                  </button>

                </article>
              )
            )}

          </div>
        </section>
      )}

      {/* =================================================
          DECODE DFA
      ================================================= */}

      {selectedMode ===
        "decode" && (
        <section className="challenge-workspace">

          <div className="workspace-header">

            <div>
              <p className="preview-label">
                CHALLENGE 01 • DECODE
                THE DFA
              </p>

              <h2>
                What language does this
                DFA accept?
              </h2>

              <p>
                Study the states and
                transitions carefully,
                then select the language
                described by this DFA.
              </p>
            </div>

            <button
              type="button"
              className="back-button"
              onClick={handleBack}
            >
              ← Back
            </button>

          </div>

          <div className="decode-progress">

            <span>
              Question{" "}
              {currentQuestionIndex +
                1}{" "}
              of{" "}
              {
                decodeQuestionsPool.length
              }
            </span>

            <button
              type="button"
              onClick={
                handleRandomQuestion
              }
              className="submit-answer"
            >
              🔀 Random Question
            </button>

          </div>

          <div className="decode-layout">

            {/* DFA PANEL */}

            <div className="dfa-panel">

              <div className="panel-heading">

                <span>
                  DFA
                </span>

                <span className="alphabet-label">
                  Alphabet:{" "}
                  {
                    currentQuestion.alphabet
                  }
                </span>

              </div>

              <DFADiagram
                question={
                  currentQuestion
                }
              />

              {/* TRANSITION TABLE */}

              <div className="transition-table">

                <div className="table-title">
                  Transition Table
                </div>

                <div className="transition-row header-row">
                  <span>
                    State
                  </span>

                  <span>
                    0
                  </span>

                  <span>
                    1
                  </span>
                </div>

                {currentQuestion.states.map(
                  (state) => {

                    const zeroTransition =
                      currentQuestion.transitions.find(
                        (
                          transition
                        ) =>
                          transition.from ===
                            state.id &&
                          transition.symbol.includes(
                            "0"
                          )
                      );

                    const oneTransition =
                      currentQuestion.transitions.find(
                        (
                          transition
                        ) =>
                          transition.from ===
                            state.id &&
                          transition.symbol.includes(
                            "1"
                          )
                      );

                    return (
                      <div
                        className="transition-row"
                        key={
                          state.id
                        }
                      >

                        <span>
                          {
                            state.id
                          }

                          {state.start && (
                            <small>
                              {" "}
                              START
                            </small>
                          )}

                          {state.final && (
                            <small>
                              {" "}
                              FINAL
                            </small>
                          )}
                        </span>

                        <span>
                          {zeroTransition
                            ? zeroTransition.to
                            : "—"}
                        </span>

                        <span>
                          {oneTransition
                            ? oneTransition.to
                            : "—"}
                        </span>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

            {/* QUESTION PANEL */}

            <div className="question-panel">

              <div className="question-number">
                QUESTION{" "}
                {String(
                  currentQuestion.id
                ).padStart(
                  2,
                  "0"
                )}
              </div>

              <h3>
                Which language is
                accepted by this DFA?
              </h3>

              <p className="question-help">
                {
                  currentQuestion.hint
                }
              </p>

              <div className="answer-options">

                {currentQuestion.options.map(
                  (
                    option,
                    index
                  ) => {

                    const optionId =
                      String(
                        index
                      );

                    const isSelected =
                      selectedAnswer ===
                      optionId;

                    const isCorrectOption =
                      index ===
                      currentQuestion.correct;

                    const isWrongSelected =
                      answerSubmitted &&
                      isSelected &&
                      !isCorrectOption;

                    return (
                      <button
                        key={
                          option
                        }
                        type="button"
                        className={`answer-option
                          ${
                            isSelected
                              ? "selected"
                              : ""
                          }
                          ${
                            answerSubmitted &&
                            isCorrectOption
                              ? "correct"
                              : ""
                          }
                          ${
                            isWrongSelected
                              ? "incorrect"
                              : ""
                          }
                        `}
                        onClick={() => {
                          if (
                            !answerSubmitted
                          ) {
                            setSelectedAnswer(
                              optionId
                            );
                          }
                        }}
                      >

                        <span className="option-letter">
                          {String.fromCharCode(
                            65 +
                              index
                          )}
                        </span>

                        <span>
                          {option}
                        </span>

                        {answerSubmitted &&
                          isCorrectOption && (
                            <span className="answer-icon">
                              ✓
                            </span>
                          )}

                      </button>
                    );
                  }
                )}

              </div>

              {!answerSubmitted && (
                <button
                  type="button"
                  className="submit-answer"
                  onClick={
                    handleSubmit
                  }
                  disabled={
                    !selectedAnswer
                  }
                >
                  Submit Answer →
                </button>
              )}

              {decodeComplete && (
                renderFinalScore(
                  "Decode the DFA Complete",
                  decodeScore,
                  decodeQuestionsPool.length,
                  handleRestartDecodeChallenge
                )
              )}

              {answerSubmitted && !decodeComplete && (
                <div
                  className={`answer-result ${
                    isCorrect
                      ? "result-correct"
                      : "result-wrong"
                  }`}
                >

                  <div className="result-title">
                    {isCorrect
                      ? "✓ Correct Answer!"
                      : "✗ Not Quite"}
                  </div>

                  <p>
                    {
                      currentQuestion.explanation
                    }
                  </p>

                  <div className="example-box">

                    <strong>
                      Examples:
                    </strong>

                    {currentQuestion.examples.map(
                      ([
                        example,
                        accepted,
                      ]) => (
                        <span
                          key={
                            example
                          }
                        >
                          {example ||
                            "ε"}{" "}
                          {accepted
                            ? "✓"
                            : "✗"}
                        </span>
                      )
                    )}

                  </div>

                  <div className="result-actions">

                    <button
                      type="button"
                      className="try-again-button"
                      onClick={
                        handleResetQuestion
                      }
                    >
                      Try Again
                    </button>

                    <button
                      type="button"
                      className="try-again-button"
                      onClick={
                        handleNextQuestion
                      }
                    >
                      Next Question →
                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>
        </section>
      )}

      {/* =================================================
          FIX DFA
      ================================================= */}

      {selectedMode ===
        "fix" && (
        <section className="challenge-workspace">

          <div className="workspace-header">

            <div>

              <p className="preview-label">
                CHALLENGE 02 • FIX THE
                DFA
              </p>

              <h2>
                Find and fix the
                incorrect transition
              </h2>

              <p>
                One transition in this
                DFA is incorrect. Identify
                the wrong transition and
                select the correct
                destination state.
              </p>

            </div>

            <button
              type="button"
              className="back-button"
              onClick={handleBack}
            >
              ← Back
            </button>

          </div>

          <div className="decode-progress">

            <span>
              Question{" "}
              {fixQuestionIndex +
                1}{" "}
              of{" "}
              {
                fixQuestionsPool.length
              }
            </span>

            <button
              type="button"
              className="submit-answer"
              onClick={
                handleRandomFixQuestion
              }
            >
              🔀 Random Question
            </button>

          </div>

          <div className="decode-layout">

            {/* DFA */}

            <div className="dfa-panel">

              <div className="panel-heading">

                <span>
                  DFA
                </span>

                <span className="alphabet-label">
                  Alphabet:{" "}
                  {
                    currentFixQuestion.alphabet
                  }
                </span>

              </div>

              <DFADiagram
                question={
                  currentFixQuestion
                }
              />

              <div className="transition-table">

                <div className="table-title">
                  Transition Table
                </div>

                <div className="transition-row header-row">

                  <span>
                    State
                  </span>

                  <span>
                    0
                  </span>

                  <span>
                    1
                  </span>

                </div>

                {currentFixQuestion.states.map(
                  (state) => {

                    const zeroTransition =
                      currentFixQuestion.transitions.find(
                        (
                          transition
                        ) =>
                          transition.from ===
                            state.id &&
                          transition.symbol.includes(
                            "0"
                          )
                      );

                    const oneTransition =
                      currentFixQuestion.transitions.find(
                        (
                          transition
                        ) =>
                          transition.from ===
                            state.id &&
                          transition.symbol.includes(
                            "1"
                          )
                      );

                    return (
                      <div
                        className="transition-row"
                        key={
                          state.id
                        }
                      >

                        <span>
                          {
                            state.id
                          }

                          {state.start && (
                            <small>
                              {" "}
                              START
                            </small>
                          )}

                          {state.final && (
                            <small>
                              {" "}
                              FINAL
                            </small>
                          )}
                        </span>

                        <span>
                          {zeroTransition
                            ? zeroTransition.to
                            : "—"}
                        </span>

                        <span>
                          {oneTransition
                            ? oneTransition.to
                            : "—"}
                        </span>

                      </div>
                    );
                  }
                )}

              </div>

              <div
                style={{
                  marginTop:
                    "18px",
                  padding:
                    "14px 16px",
                  borderRadius:
                    "12px",
                  background:
                    "#fff7ed",
                  border:
                    "1px solid #fed7aa",
                  color:
                    "#9a3412",
                }}
              >

                <strong>
                  ⚠ Incorrect
                  Transition
                </strong>

                <p
                  style={{
                    marginTop:
                      "6px",
                    fontSize:
                      "13px",
                  }}
                >
                  {
                    currentFixQuestion.wrongTransition
                  }
                </p>

              </div>

            </div>

            {/* QUESTION */}

            <div className="question-panel">

              <div className="question-number">
                QUESTION{" "}
                {String(
                  currentFixQuestion.id
                ).padStart(
                  2,
                  "0"
                )}
              </div>

              <h3>
                {
                  currentFixQuestion.title
                }
              </h3>

              <p className="question-help">
                {
                  currentFixQuestion.description
                }
              </p>

              <div
                style={{
                  marginBottom:
                    "18px",
                  padding:
                    "14px",
                  borderRadius:
                    "12px",
                  background:
                    "#eff6ff",
                  border:
                    "1px solid #dbeafe",
                  color:
                    "#1e3a8a",
                  fontSize:
                    "13px",
                  lineHeight:
                    "1.6",
                }}
              >

                <strong>
                  Your Task
                </strong>

                <p
                  style={{
                    marginTop:
                      "5px",
                  }}
                >
                  The transition{" "}
                  <strong>
                    {
                      currentFixQuestion.wrongTransition
                    }
                  </strong>{" "}
                  is incorrect.
                  Where should
                  it go instead?
                </p>

              </div>

              <div className="answer-options">

                {currentFixQuestion.options.map(
                  (option) => {

                    const isSelected =
                      selectedFixAnswer ===
                      option;

                    const isCorrectOption =
                      option ===
                      currentFixQuestion.transitions.find(
                        (
                          transition
                        ) =>
                          transition.wrong
                      )?.correctTo;

                    const isWrongSelected =
                      fixSubmitted &&
                      isSelected &&
                      !isCorrectOption;

                    return (
                      <button
                        key={
                          option
                        }
                        type="button"
                        className={`answer-option
                          ${
                            isSelected
                              ? "selected"
                              : ""
                          }
                          ${
                            fixSubmitted &&
                            isCorrectOption
                              ? "correct"
                              : ""
                          }
                          ${
                            isWrongSelected
                              ? "incorrect"
                              : ""
                          }
                        `}
                        onClick={() => {
                          if (
                            !fixSubmitted
                          ) {
                            setSelectedFixAnswer(
                              option
                            );
                          }
                        }}
                      >

                        <span className="option-letter">
                          {option}
                        </span>

                        <span>
                          Make the
                          transition go
                          to{" "}
                          <strong>
                            {option}
                          </strong>
                        </span>

                        {fixSubmitted &&
                          isCorrectOption && (
                            <span className="answer-icon">
                              ✓
                            </span>
                          )}

                      </button>
                    );
                  }
                )}

              </div>

              {!fixSubmitted && (
                <button
                  type="button"
                  className="submit-answer"
                  onClick={
                    handleFixSubmit
                  }
                  disabled={
                    !selectedFixAnswer
                  }
                >
                  Submit Fix →
                </button>
              )}

              {fixComplete && (
                renderFinalScore(
                  "Fix the DFA Complete",
                  fixScore,
                  fixQuestionsPool.length,
                  handleRestartFixChallenge
                )
              )}

              {fixSubmitted && !fixComplete && (
                <div
                  className={`answer-result ${
                    isFixCorrect
                      ? "result-correct"
                      : "result-wrong"
                  }`}
                >

                  <div className="result-title">
                    {isFixCorrect
                      ? "✓ DFA Fixed Correctly!"
                      : "✗ Incorrect Fix"}
                  </div>

                  <p>
                    {
                      currentFixQuestion.explanation
                    }
                  </p>

                  <div className="example-box">

                    <strong>
                      Correct
                      Transition:
                    </strong>

                    <span>
                      {
                        currentFixQuestion.correctTransition
                      }
                    </span>

                  </div>

                  <div className="example-box">

                    <strong>
                      Test Examples:
                    </strong>

                    {currentFixQuestion.examples.map(
                      ([
                        example,
                        accepted,
                      ]) => (
                        <span
                          key={`${example}-${accepted}`}
                        >
                          {example ||
                            "ε"}{" "}
                          {accepted
                            ? "✓"
                            : "✗"}
                        </span>
                      )
                    )}

                  </div>

                  <div className="result-actions">

                    <button
                      type="button"
                      className="try-again-button"
                      onClick={
                        handleFixTryAgain
                      }
                    >
                      Try Again
                    </button>

                    <button
                      type="button"
                      className="try-again-button"
                      onClick={
                        handleNextFixQuestion
                      }
                    >
                      Next Question →
                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>
        </section>
      )}

      {/* =================================================
          BUILD THE ANSWER
      ================================================= */}

      {selectedMode ===
        "build" && (
        <section className="challenge-workspace">

          {/* HEADER */}

          <div className="workspace-header">

            <div>

              <p className="preview-label">
                CHALLENGE 03 • BUILD THE
                ANSWER
              </p>

              <h2>
                Build the correct DFA
              </h2>

              <p>
                Read the requirement,
                choose the states, and
                construct the correct
                transition table.
              </p>

            </div>

            <button
              type="button"
              className="back-button"
              onClick={handleBack}
            >
              ← Back
            </button>

          </div>

          {/* PROGRESS */}

          <div className="decode-progress">

            <span>
              Question{" "}
              {buildQuestionIndex +
                1}{" "}
              of{" "}
              {
                buildQuestionsPool.length
              }
            </span>

            <button
              type="button"
              className="submit-answer"
              onClick={
                handleRandomBuildQuestion
              }
            >
              🔀 Random Question
            </button>

          </div>

          {/* BUILD AREA */}

          <div
            className="decode-layout"
            style={{
              alignItems:
                "flex-start",
            }}
          >

            {/* =================================================
                LEFT REQUIREMENT PANEL
            ================================================= */}

            <div className="dfa-panel">

              <div className="panel-heading">

                <span>
                  DFA REQUIREMENT
                </span>

                <span className="alphabet-label">
                  Alphabet:{" "}
                  {
                    currentBuildQuestion.alphabet
                  }
                </span>

              </div>

              <div
                style={{
                  padding:
                    "22px",
                  background:
                    "linear-gradient(135deg, #eff6ff, #f8fafc)",
                  border:
                    "1px solid #dbeafe",
                  borderRadius:
                    "16px",
                  marginBottom:
                    "20px",
                }}
              >

                <div
                  style={{
                    fontSize:
                      "12px",
                    fontWeight:
                      "800",
                    letterSpacing:
                      "1.5px",
                    color:
                      "#2563eb",
                    marginBottom:
                      "10px",
                  }}
                >
                  YOUR TASK
                </div>

                <h3
                  style={{
                    margin:
                      "0 0 10px",
                    color:
                      "#0f172a",
                    fontSize:
                      "22px",
                  }}
                >
                  {
                    currentBuildQuestion.title
                  }
                </h3>

                <p
                  style={{
                    margin: 0,
                    color:
                      "#475569",
                    lineHeight:
                      "1.7",
                    fontSize:
                      "14px",
                  }}
                >
                  {
                    currentBuildQuestion.requirement
                  }
                </p>

              </div>

              {/* PREVIEW */}

              <div className="transition-table">

                <div className="table-title">
                  Your DFA Preview
                </div>

                <div className="transition-row header-row">

                  <span>
                    State
                  </span>

                  {currentBuildQuestion.alphabetSymbols.map(
                    (symbol) => (
                      <span
                        key={
                          symbol
                        }
                      >
                        {symbol}
                      </span>
                    )
                  )}

                </div>

                {currentBuildQuestion.states.map(
                  (state) => (
                    <div
                      className="transition-row"
                      key={
                        state
                      }
                    >

                      <span>

                        {state}

                        {buildStartState ===
                          state && (
                          <small>
                            {" "}
                            START
                          </small>
                        )}

                        {buildFinalState ===
                          state && (
                          <small>
                            {" "}
                            FINAL
                          </small>
                        )}

                      </span>

                      {currentBuildQuestion.alphabetSymbols.map(
                        (symbol) => (
                          <span
                            key={`${state}_${symbol}`}
                          >
                            {
                              buildTransitions[
                                `${state}_${symbol}`
                              ] ||
                              "—"
                            }
                          </span>
                        )
                      )}

                    </div>
                  )
                )}

              </div>

              {/* TIP */}

              <div
                style={{
                  marginTop:
                    "18px",
                  padding:
                    "14px 16px",
                  borderRadius:
                    "12px",
                  background:
                    "#f8fafc",
                  border:
                    "1px solid #e2e8f0",
                  color:
                    "#475569",
                  fontSize:
                    "13px",
                  lineHeight:
                    "1.6",
                }}
              >

                <strong>
                  💡 Tip
                </strong>

                <p
                  style={{
                    marginTop:
                      "5px",
                  }}
                >
                  Think about what each
                  state should remember.
                  The final state must
                  represent the condition
                  described in the question.
                </p>

              </div>

            </div>

            {/* =================================================
                RIGHT BUILD PANEL
            ================================================= */}

            <div className="question-panel">

              <div className="question-number">
                QUESTION{" "}
                {String(
                  currentBuildQuestion.id
                ).padStart(
                  2,
                  "0"
                )}
              </div>

              <h3>
                Construct your DFA
              </h3>

              <p className="question-help">
                Select the start state,
                final state, and
                destination state for
                every transition.
              </p>

              {/* START STATE */}

              <div
                style={{
                  marginBottom:
                    "18px",
                }}
              >

                <label
                  htmlFor="build-start-state"
                  style={{
                    display:
                      "block",
                    marginBottom:
                      "8px",
                    fontSize:
                      "13px",
                    fontWeight:
                      "800",
                    color:
                      "#334155",
                  }}
                >
                  1. Select Start State
                </label>

                <select
                  id="build-start-state"
                  value={
                    buildStartState
                  }
                  onChange={(event) =>
                    handleBuildStartChange(
                      event.target.value
                    )
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "13px 14px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius:
                      "10px",
                    background:
                      "white",
                    color:
                      "#0f172a",
                    outline:
                      "none",
                  }}
                >

                  <option value="">
                    Select start state
                  </option>

                  {currentBuildQuestion.states.map(
                    (state) => (
                      <option
                        key={
                          state
                        }
                        value={
                          state
                        }
                      >
                        {state}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* FINAL STATE */}

              <div
                style={{
                  marginBottom:
                    "22px",
                }}
              >

                <label
                  htmlFor="build-final-state"
                  style={{
                    display:
                      "block",
                    marginBottom:
                      "8px",
                    fontSize:
                      "13px",
                    fontWeight:
                      "800",
                    color:
                      "#334155",
                  }}
                >
                  2. Select Final State
                </label>

                <select
                  id="build-final-state"
                  value={
                    buildFinalState
                  }
                  onChange={(event) =>
                    handleBuildFinalChange(
                      event.target.value
                    )
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "13px 14px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius:
                      "10px",
                    background:
                      "white",
                    color:
                      "#0f172a",
                    outline:
                      "none",
                  }}
                >

                  <option value="">
                    Select final state
                  </option>

                  {currentBuildQuestion.states.map(
                    (state) => (
                      <option
                        key={
                          state
                        }
                        value={
                          state
                        }
                      >
                        {state}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* TRANSITIONS */}

              <div
                style={{
                  marginBottom:
                    "22px",
                }}
              >

                <div
                  style={{
                    marginBottom:
                      "12px",
                    fontSize:
                      "13px",
                    fontWeight:
                      "800",
                    color:
                      "#334155",
                  }}
                >
                  3. Define Transitions
                </div>

                {currentBuildQuestion.states.map(
                  (state) => (
                    <div
                      key={
                        state
                      }
                      style={{
                        marginBottom:
                          "16px",
                        padding:
                          "16px",
                        border:
                          "1px solid #e2e8f0",
                        borderRadius:
                          "14px",
                        background:
                          "#f8fafc",
                      }}
                    >

                      <div
                        style={{
                          marginBottom:
                            "12px",
                          fontWeight:
                            "800",
                          color:
                            "#2563eb",
                        }}
                      >
                        State{" "}
                        {state}
                      </div>

                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "1fr 1fr",
                          gap:
                            "12px",
                        }}
                      >

                        {currentBuildQuestion.alphabetSymbols.map(
                          (
                            symbol
                          ) => {

                            const transitionKey =
                              `${state}_${symbol}`;

                            return (
                              <div
                                key={
                                  transitionKey
                                }
                              >

                                <label
                                  htmlFor={
                                    transitionKey
                                  }
                                  style={{
                                    display:
                                      "block",
                                    marginBottom:
                                      "6px",
                                    fontSize:
                                      "12px",
                                    fontWeight:
                                      "700",
                                    color:
                                      "#64748b",
                                  }}
                                >
                                  On input{" "}
                                  <strong>
                                    {
                                      symbol
                                    }
                                  </strong>
                                </label>

                                <select
                                  id={
                                    transitionKey
                                  }
                                  value={
                                    buildTransitions[
                                      transitionKey
                                    ] ||
                                    ""
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    handleBuildTransitionChange(
                                      state,
                                      symbol,
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  style={{
                                    width:
                                      "100%",
                                    padding:
                                      "11px 10px",
                                    border:
                                      "1px solid #cbd5e1",
                                    borderRadius:
                                      "9px",
                                    background:
                                      "white",
                                    color:
                                      "#0f172a",
                                    outline:
                                      "none",
                                  }}
                                >

                                  <option value="">
                                    Select
                                  </option>

                                  {currentBuildQuestion.states.map(
                                    (
                                      destination
                                    ) => (
                                      <option
                                        key={
                                          destination
                                        }
                                        value={
                                          destination
                                        }
                                      >
                                        →
                                        {" "}
                                        {
                                          destination
                                        }
                                      </option>
                                    )
                                  )}

                                </select>

                              </div>
                            );
                          }
                        )}

                      </div>

                    </div>
                  )
                )}

              </div>

              {/* CHECK */}

              {!buildResult && (
                <button
                  type="button"
                  className="submit-answer"
                  onClick={
                    handleCheckBuild
                  }
                >
                  ✓ Check DFA
                </button>
              )}

              {/* RESULT */}

              {renderBuildResult()}

            </div>

          </div>
        </section>
      )}

    </main>
  );
}

export default Challenge;