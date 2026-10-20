import { useEffect, useRef, useState } from "react";
import "../styles/Simulator.css";

const GRID_WIDTH = 900;
const GRID_HEIGHT = 560;

const STATE_RADIUS = 48;

const INITIAL_STATE = {
  id: "q0",
  x: 180,
  y: 280,
  isStart: true,
  isFinal: false,
  isDead: false,
};

/* ==================================================
   DFA QUESTIONS
================================================== */

const DFA_QUESTIONS = [
  {
    id: "ends-1",
    number: "01",
    title: "Ends with 1",
    description: "Accept binary strings that end with 1.",
  },
  {
    id: "ends-0",
    number: "02",
    title: "Ends with 0",
    description: "Accept binary strings that end with 0.",
  },
  {
    id: "starts-1",
    number: "03",
    title: "Starts with 1",
    description: "Accept binary strings that start with 1.",
  },
  {
    id: "starts-0",
    number: "04",
    title: "Starts with 0",
    description: "Accept binary strings that start with 0.",
  },
  {
    id: "contains-01",
    number: "05",
    title: "Contains 01",
    description: "Accept binary strings containing the pattern 01.",
  },
  {
    id: "contains-10",
    number: "06",
    title: "Contains 10",
    description: "Accept binary strings containing the pattern 10.",
  },
  {
    id: "even-0s",
    number: "07",
    title: "Even Number of 0s",
    description: "Accept strings containing an even number of 0s.",
  },
  {
    id: "even-1s",
    number: "08",
    title: "Even Number of 1s",
    description: "Accept strings containing an even number of 1s.",
  },
  {
    id: "string-ends-a",
    number: "09",
    title: "Ends with a",
    description: "Accept strings over {a,b} that end with a.",
  },
  {
    id: "string-starts-a",
    number: "10",
    title: "Starts with a",
    description: "Accept strings over {a,b} that start with a.",
  },
  {
    id: "string-contains-ab",
    number: "11",
    title: "Contains ab",
    description: "Accept strings over {a,b} containing the pattern ab.",
  },
  {
    id: "string-even-a",
    number: "12",
    title: "Even Number of a's",
    description: "Accept strings over {a,b} containing an even number of a's.",
  },
];

function Simulator() {
  const [states, setStates] = useState([INITIAL_STATE]);

  const [transitions, setTransitions] = useState([]);

  const [selectedState, setSelectedState] = useState("q0");

  const [startState, setStartState] = useState("q0");

  const [fromState, setFromState] = useState("q0");

  const [toState, setToState] = useState("q0");

  const [symbol, setSymbol] = useState("0");

  const [testInput, setTestInput] = useState("");

  const [currentState, setCurrentState] = useState("q0");

  const [running, setRunning] = useState(false);

  const [testResult, setTestResult] = useState("");

  const [testStep, setTestStep] = useState(0);

  const [testPath, setTestPath] = useState([]);

  const [message, setMessage] = useState(
    "Select a question or build your own DFA."
  );

  const [selectedQuestion, setSelectedQuestion] =
    useState("ends-1");

  const timerRef = useRef(null);
  const resultTimerRef = useRef(null);

  const dragRef = useRef(null);

  /* ==================================================
     CLEANUP
  ================================================== */

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (resultTimerRef.current) {
        clearTimeout(resultTimerRef.current);
      }

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp
      );
    };
  }, []);

  /* ==================================================
     SELECTED STATE
  ================================================== */

  const selectedStateObject = states.find(
    (state) => state.id === selectedState
  );

  /* ==================================================
     QUESTION SELECTOR
  ================================================== */

  const getQuestionById = (questionId) => {
    return DFA_QUESTIONS.find(
      (question) => question.id === questionId
    );
  };

  /* ==================================================
     ADD STATE
  ================================================== */

  const addState = () => {
    const newId = `q${states.length}`;

    const defaultPositions = [
      { x: 180, y: 280 },
      { x: 450, y: 280 },
      { x: 720, y: 280 },
      { x: 180, y: 450 },
      { x: 450, y: 450 },
      { x: 720, y: 450 },
      { x: 180, y: 120 },
      { x: 450, y: 120 },
      { x: 720, y: 120 },
    ];

    const position =
      defaultPositions[states.length] || {
        x: 120 + ((states.length - 1) % 4) * 210,
        y:
          120 +
          Math.floor((states.length - 1) / 4) * 160,
      };

    const newState = {
      id: newId,

      x: Math.min(
        Math.max(position.x, 70),
        GRID_WIDTH - 70
      ),

      y: Math.min(
        Math.max(position.y, 80),
        GRID_HEIGHT - 70
      ),

      isStart: false,
      isFinal: false,
      isDead: false,
    };

    setStates((previous) => [
      ...previous,
      newState,
    ]);

    setSelectedState(newId);
    setFromState(newId);
    setToState(newId);

    setCurrentState(startState);

    setTestResult("");
    setTestPath([]);
    setTestStep(0);

    setMessage(
      `${newId} added. Select it or drag it on the grid.`
    );
  };

  /* ==================================================
     LOAD SELECTED QUESTION DFA
  ================================================== */

  const loadQuestionDFA = (questionId) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (resultTimerRef.current) {
      clearTimeout(resultTimerRef.current);
      resultTimerRef.current = null;
    }

    let exampleStates = [];
    let exampleTransitions = [];

    /* ==================================================
       01 - ENDS WITH 1
    ================================================== */

    if (questionId === "ends-1") {
      exampleStates = [
        {
          id: "q0",
          x: 230,
          y: 300,
          isStart: true,
          isFinal: false,
          isDead: false,
        },
        {
          id: "q1",
          x: 670,
          y: 300,
          isStart: false,
          isFinal: true,
          isDead: false,
        },
      ];

      exampleTransitions = [
        {
          id: "ends1-0",
          from: "q0",
          to: "q0",
          symbol: "0",
          controlX: 230,
          controlY: 205,
        },
        {
          id: "ends1-1",
          from: "q0",
          to: "q1",
          symbol: "1",
        },
        {
          id: "ends1-2",
          from: "q1",
          to: "q0",
          symbol: "0",
        },
        {
          id: "ends1-3",
          from: "q1",
          to: "q1",
          symbol: "1",
          controlX: 670,
          controlY: 205,
        },
      ];
    }

    /* ==================================================
       02 - ENDS WITH 0
    ================================================== */

    else if (questionId === "ends-0") {
      exampleStates = [
        {
          id: "q0",
          x: 230,
          y: 300,
          isStart: true,
          isFinal: false,
          isDead: false,
        },
        {
          id: "q1",
          x: 670,
          y: 300,
          isStart: false,
          isFinal: true,
          isDead: false,
        },
      ];

      exampleTransitions = [
        {
          id: "ends0-0",
          from: "q0",
          to: "q0",
          symbol: "1",
          controlX: 230,
          controlY: 205,
        },
        {
          id: "ends0-1",
          from: "q0",
          to: "q1",
          symbol: "0",
        },
        {
          id: "ends0-2",
          from: "q1",
          to: "q0",
          symbol: "1",
        },
        {
          id: "ends0-3",
          from: "q1",
          to: "q1",
          symbol: "0",
          controlX: 670,
          controlY: 205,
        },
      ];
    }

    /* ==================================================
       03 - STARTS WITH 1
    ================================================== */

    else if (questionId === "starts-1") {
      exampleStates = [
        {
          id: "q0",
          x: 150,
          y: 300,
          isStart: true,
          isFinal: false,
          isDead: false,
        },
        {
          id: "q1",
          x: 450,
          y: 200,
          isStart: false,
          isFinal: true,
          isDead: false,
        },
        {
          id: "q2",
          x: 700,
          y: 400,
          isStart: false,
          isFinal: false,
          isDead: true,
        },
      ];

      exampleTransitions = [
        {
          id: "starts1-0",
          from: "q0",
          to: "q1",
          symbol: "1",
        },
        {
          id: "starts1-1",
          from: "q0",
          to: "q2",
          symbol: "0",
        },
        {
          id: "starts1-2",
          from: "q1",
          to: "q1",
          symbol: "0",
          controlX: 450,
          controlY: 100,
        },
        {
          id: "starts1-3",
          from: "q1",
          to: "q1",
          symbol: "1",
          controlX: 550,
          controlY: 200,
        },
        {
          id: "starts1-4",
          from: "q2",
          to: "q2",
          symbol: "0",
          controlX: 700,
          controlY: 285,
        },
        {
          id: "starts1-5",
          from: "q2",
          to: "q2",
          symbol: "1",
          controlX: 800,
          controlY: 400,
        },
      ];
    }

    /* ==================================================
       04 - STARTS WITH 0
    ================================================== */

    else if (questionId === "starts-0") {
      exampleStates = [
        {
          id: "q0",
          x: 150,
          y: 300,
          isStart: true,
          isFinal: false,
          isDead: false,
        },
        {
          id: "q1",
          x: 450,
          y: 200,
          isStart: false,
          isFinal: true,
          isDead: false,
        },
        {
          id: "q2",
          x: 700,
          y: 400,
          isStart: false,
          isFinal: false,
          isDead: true,
        },
      ];

      exampleTransitions = [
        {
          id: "starts0-0",
          from: "q0",
          to: "q1",
          symbol: "0",
        },
        {
          id: "starts0-1",
          from: "q0",
          to: "q2",
          symbol: "1",
        },
        {
          id: "starts0-2",
          from: "q1",
          to: "q1",
          symbol: "0",
          controlX: 450,
          controlY: 100,
        },
        {
          id: "starts0-3",
          from: "q1",
          to: "q1",
          symbol: "1",
          controlX: 550,
          controlY: 200,
        },
        {
          id: "starts0-4",
          from: "q2",
          to: "q2",
          symbol: "0",
          controlX: 700,
          controlY: 285,
        },
        {
          id: "starts0-5",
          from: "q2",
          to: "q2",
          symbol: "1",
          controlX: 800,
          controlY: 400,
        },
      ];
    }

    /* ==================================================
       05 - CONTAINS 01
    ================================================== */

    else if (questionId === "contains-01") {
      exampleStates = [
        {
          id: "q0",
          x: 150,
          y: 300,
          isStart: true,
          isFinal: false,
          isDead: false,
        },
        {
          id: "q1",
          x: 450,
          y: 200,
          isStart: false,
          isFinal: false,
          isDead: false,
        },
        {
          id: "q2",
          x: 700,
          y: 300,
          isStart: false,
          isFinal: true,
          isDead: false,
        },
      ];

      exampleTransitions = [
        {
          id: "contains01-0",
          from: "q0",
          to: "q1",
          symbol: "0",
        },
        {
          id: "contains01-1",
          from: "q0",
          to: "q0",
          symbol: "1",
          controlX: 150,
          controlY: 205,
        },
        {
          id: "contains01-2",
          from: "q1",
          to: "q1",
          symbol: "0",
          controlX: 450,
          controlY: 100,
        },
        {
          id: "contains01-3",
          from: "q1",
          to: "q2",
          symbol: "1",
        },
        {
          id: "contains01-4",
          from: "q2",
          to: "q2",
          symbol: "0",
          controlX: 700,
          controlY: 205,
        },
        {
          id: "contains01-5",
          from: "q2",
          to: "q2",
          symbol: "1",
          controlX: 800,
          controlY: 300,
        },
      ];
    }

    /* ==================================================
       06 - CONTAINS 10
    ================================================== */

    else if (questionId === "contains-10") {
      exampleStates = [
        {
          id: "q0",
          x: 150,
          y: 300,
          isStart: true,
          isFinal: false,
          isDead: false,
        },
        {
          id: "q1",
          x: 450,
          y: 200,
          isStart: false,
          isFinal: false,
          isDead: false,
        },
        {
          id: "q2",
          x: 700,
          y: 300,
          isStart: false,
          isFinal: true,
          isDead: false,
        },
      ];

      exampleTransitions = [
        {
          id: "contains10-0",
          from: "q0",
          to: "q1",
          symbol: "1",
        },
        {
          id: "contains10-1",
          from: "q0",
          to: "q0",
          symbol: "0",
          controlX: 150,
          controlY: 205,
        },
        {
          id: "contains10-2",
          from: "q1",
          to: "q1",
          symbol: "1",
          controlX: 450,
          controlY: 100,
        },
        {
          id: "contains10-3",
          from: "q1",
          to: "q2",
          symbol: "0",
        },
        {
          id: "contains10-4",
          from: "q2",
          to: "q2",
          symbol: "0",
          controlX: 700,
          controlY: 205,
        },
        {
          id: "contains10-5",
          from: "q2",
          to: "q2",
          symbol: "1",
          controlX: 800,
          controlY: 300,
        },
      ];
    }

    /* ==================================================
       07 - EVEN NUMBER OF 0s
    ================================================== */

    else if (questionId === "even-0s") {
      exampleStates = [
        {
          id: "q0",
          x: 230,
          y: 300,
          isStart: true,
          isFinal: true,
          isDead: false,
        },
        {
          id: "q1",
          x: 670,
          y: 300,
          isStart: false,
          isFinal: false,
          isDead: false,
        },
      ];

      exampleTransitions = [
        {
          id: "even0-0",
          from: "q0",
          to: "q1",
          symbol: "0",
        },
        {
          id: "even0-1",
          from: "q1",
          to: "q0",
          symbol: "0",
        },
        {
          id: "even0-2",
          from: "q0",
          to: "q0",
          symbol: "1",
          controlX: 230,
          controlY: 205,
        },
        {
          id: "even0-3",
          from: "q1",
          to: "q1",
          symbol: "1",
          controlX: 670,
          controlY: 205,
        },
      ];
    }

    /* ==================================================
       08 - EVEN NUMBER OF 1s
    ================================================== */

    else if (questionId === "even-1s") {
      exampleStates = [
        {
          id: "q0",
          x: 230,
          y: 300,
          isStart: true,
          isFinal: true,
          isDead: false,
        },
        {
          id: "q1",
          x: 670,
          y: 300,
          isStart: false,
          isFinal: false,
          isDead: false,
        },
      ];

      exampleTransitions = [
        {
          id: "even1-0",
          from: "q0",
          to: "q1",
          symbol: "1",
        },
        {
          id: "even1-1",
          from: "q1",
          to: "q0",
          symbol: "1",
        },
        {
          id: "even1-2",
          from: "q0",
          to: "q0",
          symbol: "0",
          controlX: 230,
          controlY: 205,
        },
        {
          id: "even1-3",
          from: "q1",
          to: "q1",
          symbol: "0",
          controlX: 670,
          controlY: 205,
        },
      ];
    }

    /* ==================================================
       09 - STRINGS ENDING WITH a
    ================================================== */

    else if (questionId === "string-ends-a") {
      exampleStates = [
        {
          id: "q0",
          x: 230,
          y: 300,
          isStart: true,
          isFinal: false,
          isDead: false,
        },
        {
          id: "q1",
          x: 670,
          y: 300,
          isStart: false,
          isFinal: true,
          isDead: false,
        },
      ];

      exampleTransitions = [
        {
          id: "endsa-0",
          from: "q0",
          to: "q0",
          symbol: "b",
          controlX: 230,
          controlY: 205,
        },
        {
          id: "endsa-1",
          from: "q0",
          to: "q1",
          symbol: "a",
        },
        {
          id: "endsa-2",
          from: "q1",
          to: "q0",
          symbol: "b",
        },
        {
          id: "endsa-3",
          from: "q1",
          to: "q1",
          symbol: "a",
          controlX: 670,
          controlY: 205,
        },
      ];
    }

    /* ==================================================
       10 - STRINGS STARTING WITH a
    ================================================== */

    else if (questionId === "string-starts-a") {
      exampleStates = [
        {
          id: "q0",
          x: 230,
          y: 300,
          isStart: true,
          isFinal: false,
          isDead: false,
        },
        {
          id: "q1",
          x: 670,
          y: 300,
          isStart: false,
          isFinal: true,
          isDead: false,
        },
      ];

      exampleTransitions = [
        {
          id: "startsa-0",
          from: "q0",
          to: "q1",
          symbol: "a",
        },
        {
          id: "startsa-1",
          from: "q1",
          to: "q1",
          symbol: "a",
          controlX: 670,
          controlY: 205,
        },
        {
          id: "startsa-2",
          from: "q1",
          to: "q1",
          symbol: "b",
          controlX: 760,
          controlY: 300,
        },
      ];
    }

    /* ==================================================
       11 - STRINGS CONTAINING ab
    ================================================== */

    else if (questionId === "string-contains-ab") {
      exampleStates = [
        {
          id: "q0",
          x: 150,
          y: 300,
          isStart: true,
          isFinal: false,
          isDead: false,
        },
        {
          id: "q1",
          x: 450,
          y: 300,
          isStart: false,
          isFinal: false,
          isDead: false,
        },
        {
          id: "q2",
          x: 750,
          y: 300,
          isStart: false,
          isFinal: true,
          isDead: false,
        },
      ];

      exampleTransitions = [
        {
          id: "containsab-0",
          from: "q0",
          to: "q1",
          symbol: "a",
        },
        {
          id: "containsab-1",
          from: "q0",
          to: "q0",
          symbol: "b",
          controlX: 150,
          controlY: 205,
        },
        {
          id: "containsab-2",
          from: "q1",
          to: "q1",
          symbol: "a",
          controlX: 450,
          controlY: 205,
        },
        {
          id: "containsab-3",
          from: "q1",
          to: "q2",
          symbol: "b",
        },
        {
          id: "containsab-4",
          from: "q2",
          to: "q2",
          symbol: "a",
          controlX: 750,
          controlY: 205,
        },
        {
          id: "containsab-5",
          from: "q2",
          to: "q2",
          symbol: "b",
          controlX: 840,
          controlY: 300,
        },
      ];
    }

    /* ==================================================
       12 - EVEN NUMBER OF a's
    ================================================== */

    else if (questionId === "string-even-a") {
      exampleStates = [
        {
          id: "q0",
          x: 230,
          y: 300,
          isStart: true,
          isFinal: true,
          isDead: false,
        },
        {
          id: "q1",
          x: 670,
          y: 300,
          isStart: false,
          isFinal: false,
          isDead: false,
        },
      ];

      exampleTransitions = [
        {
          id: "evena-0",
          from: "q0",
          to: "q1",
          symbol: "a",
        },
        {
          id: "evena-1",
          from: "q1",
          to: "q0",
          symbol: "a",
        },
        {
          id: "evena-2",
          from: "q0",
          to: "q0",
          symbol: "b",
          controlX: 230,
          controlY: 205,
        },
        {
          id: "evena-3",
          from: "q1",
          to: "q1",
          symbol: "b",
          controlX: 670,
          controlY: 205,
        },
      ];
    }

    const question = getQuestionById(questionId);

    setStates(exampleStates);
    setTransitions(exampleTransitions);

    setSelectedState("q0");
    setStartState("q0");
    setFromState("q0");

    setToState(
      exampleStates.length > 1
        ? exampleStates[1].id
        : "q0"
    );

    setSymbol(
      questionId.startsWith("string-")
        ? "a"
        : "0"
    );

    setCurrentState("q0");

    setRunning(false);
    setTestInput("");
    setTestResult("");
    setTestStep(0);
    setTestPath([]);

    setMessage(
      `${question?.title || "DFA"} example loaded successfully.`
    );
  };

  /* ==================================================
     SELECT QUESTION
  ================================================== */

  const selectQuestion = (questionId) => {
    if (running) {
      return;
    }

    clearDFA();

    setSelectedQuestion(questionId);

    const question = getQuestionById(questionId);

    setMessage(
      `${question?.title || "DFA"} selected. Click "Load Selected Example" to load the DFA.`
    );
  };

  /* ==================================================
     LOAD EXAMPLE BUTTON
  ================================================== */

  const loadExampleDFA = () => {
    loadQuestionDFA(selectedQuestion);
  };

  /* ==================================================
     DELETE STATE
  ================================================== */

  const deleteState = () => {
    if (!selectedStateObject) {
      return;
    }

    if (selectedState === startState) {
      setMessage(
        "The start state cannot be deleted. Make another state the start state first."
      );

      return;
    }

    const stateToDelete = selectedState;

    setStates((previous) =>
      previous.filter(
        (state) => state.id !== stateToDelete
      )
    );

    setTransitions((previous) =>
      previous.filter(
        (transition) =>
          transition.from !== stateToDelete &&
          transition.to !== stateToDelete
      )
    );

    setSelectedState(startState);
    setFromState(startState);
    setToState(startState);
    setCurrentState(startState);

    setTestResult("");
    setTestStep(0);
    setTestPath([]);

    setMessage(`${stateToDelete} deleted.`);
  };

  /* ==================================================
     MAKE START STATE
  ================================================== */

  const makeStartState = () => {
    if (!selectedStateObject) {
      return;
    }

    setStates((previous) =>
      previous.map((state) => ({
        ...state,
        isStart: state.id === selectedState,
      }))
    );

    setStartState(selectedState);

    setCurrentState(selectedState);

    setTestResult("");
    setTestStep(0);
    setTestPath([]);

    setMessage(
      `${selectedState} is now the start state.`
    );
  };

  /* ==================================================
     MAKE / REMOVE FINAL STATE
  ================================================== */

  const toggleFinalState = () => {
    if (!selectedStateObject) {
      return;
    }

    const becomingFinal =
      !selectedStateObject.isFinal;

    setStates((previous) =>
      previous.map((state) =>
        state.id === selectedState
          ? {
              ...state,
              isFinal: becomingFinal,
              isDead: becomingFinal
                ? false
                : state.isDead,
            }
          : state
      )
    );

    setTestResult("");

    setMessage(
      becomingFinal
        ? `${selectedState} marked as a final state.`
        : `${selectedState} is no longer a final state.`
    );
  };

  /* ==================================================
     MAKE / REMOVE TRAP STATE
================================================== */

  const toggleTrapState = () => {
    if (!selectedStateObject) {
      return;
    }

    const becomingTrap =
      !selectedStateObject.isDead;

    setStates((previous) =>
      previous.map((state) =>
        state.id === selectedState
          ? {
              ...state,

              isDead: becomingTrap,

              isFinal: becomingTrap
                ? false
                : state.isFinal,
            }
          : state
      )
    );

    setTestResult("");

    setTestStep(0);
    setTestPath([]);

    setMessage(
      becomingTrap
        ? `${selectedState} marked as a trap state.`
        : `${selectedState} is no longer a trap state.`
    );
  };

  /* ==================================================
     SELECT STATE
  ================================================== */

  const selectState = (stateId) => {
    if (running) {
      return;
    }

    setSelectedState(stateId);
    setFromState(stateId);

    setMessage(`${stateId} selected.`);
  };

  /* ==================================================
     GET GRID POSITION
  ================================================== */

  const getGridPosition = (event) => {
    const grid =
      document.querySelector(".dfa-grid");

    if (!grid) {
      return null;
    }

    const rect =
      grid.getBoundingClientRect();

    return {
      x: Math.max(
        20,
        Math.min(
          GRID_WIDTH - 20,
          event.clientX - rect.left
        )
      ),

      y: Math.max(
        20,
        Math.min(
          GRID_HEIGHT - 20,
          event.clientY - rect.top
        )
      ),
    };
  };

  /* ==================================================
     DRAG STATE
  ================================================== */

  const handlePointerDown = (
    event,
    stateId
  ) => {
    if (running) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const grid =
      event.currentTarget.parentElement;

    const rect =
      grid.getBoundingClientRect();

    const state =
      states.find(
        (item) => item.id === stateId
      );

    if (!state) {
      return;
    }

    setSelectedState(stateId);
    setFromState(stateId);

    dragRef.current = {
      type: "state",
      stateId,

      offsetX:
        event.clientX -
        rect.left -
        state.x,

      offsetY:
        event.clientY -
        rect.top -
        state.y,
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp
    );
  };

  /* ==================================================
     POINTER MOVE
  ================================================== */

  const handlePointerMove = (event) => {
    if (!dragRef.current) {
      return;
    }

    const position =
      getGridPosition(event);

    if (!position) {
      return;
    }

    if (
      dragRef.current.type ===
      "state"
    ) {
      const {
        stateId,
        offsetX,
        offsetY,
      } = dragRef.current;

      const grid =
        document.querySelector(
          ".dfa-grid"
        );

      if (!grid) {
        return;
      }

      const rect =
        grid.getBoundingClientRect();

      const newX = Math.max(
        70,
        Math.min(
          GRID_WIDTH - 70,
          event.clientX -
            rect.left -
            offsetX
        )
      );

      const newY = Math.max(
        80,
        Math.min(
          GRID_HEIGHT - 70,
          event.clientY -
            rect.top -
            offsetY
        )
      );

      setStates((previous) =>
        previous.map((state) =>
          state.id === stateId
            ? {
                ...state,
                x: newX,
                y: newY,
              }
            : state
        )
      );

      return;
    }

    if (
      dragRef.current.type ===
      "transition"
    ) {
      const {
        transitionId,
      } = dragRef.current;

      setTransitions((previous) =>
        previous.map((transition) =>
          transition.id === transitionId
            ? {
                ...transition,
                controlX: position.x,
                controlY: position.y,
              }
            : transition
        )
      );
    }
  };

  /* ==================================================
     POINTER UP
  ================================================== */

  const handlePointerUp = () => {
    dragRef.current = null;

    window.removeEventListener(
      "pointermove",
      handlePointerMove
    );

    window.removeEventListener(
      "pointerup",
      handlePointerUp
    );
  };

  /* ==================================================
     ADD / UPDATE TRANSITION
  ================================================== */

  const addTransition = () => {
    if (!fromState || !toState) {
      setMessage(
        "Select both From State and To State."
      );

      return;
    }

    const existing =
      transitions.find(
        (transition) =>
          transition.from === fromState &&
          transition.symbol === symbol
      );

    if (existing) {
      setTransitions((previous) =>
        previous.map((transition) =>
          transition.id === existing.id
            ? {
                ...transition,
                to: toState,
                controlX: undefined,
                controlY: undefined,
              }
            : transition
        )
      );

      setMessage(
        `${fromState} --${symbol}→ ${toState} updated.`
      );
    } else {
      const from =
        getStatePosition(fromState);

      let newTransition = {
        id: Date.now(),
        from: fromState,
        to: toState,
        symbol,
      };

      if (
        from &&
        fromState === toState
      ) {
        newTransition = {
          ...newTransition,
          controlX: from.x,
          controlY: from.y - 115,
        };
      }

      setTransitions((previous) => [
        ...previous,
        newTransition,
      ]);

      setMessage(
        `${fromState} --${symbol}→ ${toState} added.`
      );
    }

    setTestResult("");
    setTestStep(0);
    setTestPath([]);
  };

  /* ==================================================
     DELETE TRANSITION
  ================================================== */

  const deleteTransition = (id) => {
    setTransitions((previous) =>
      previous.filter(
        (transition) =>
          transition.id !== id
      )
    );

    setTestResult("");
    setTestStep(0);
    setTestPath([]);

    setMessage("Transition deleted.");
  };

  /* ==================================================
     CLEAR DFA
  ================================================== */

  const clearDFA = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (resultTimerRef.current) {
      clearTimeout(
        resultTimerRef.current
      );

      resultTimerRef.current = null;
    }

    setStates([
      {
        ...INITIAL_STATE,
      },
    ]);

    setTransitions([]);

    setSelectedState("q0");
    setStartState("q0");
    setFromState("q0");
    setToState("q0");
    setSymbol("0");
    setTestInput("");
    setCurrentState("q0");
    setRunning(false);
    setTestResult("");
    setTestStep(0);
    setTestPath([]);

    setMessage(
      "DFA cleared. Start building again."
    );
  };

  /* ==================================================
     RESET TEST
  ================================================== */

  const resetTest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (resultTimerRef.current) {
      clearTimeout(resultTimerRef.current);
      resultTimerRef.current = null;
    }

    setRunning(false);
    setTestResult("");
    setTestStep(0);
    setCurrentState(startState);
    setTestPath([]);

    setMessage(
      "Test reset. Your DFA is still saved."
    );
  };

  /* ==================================================
     RUN DFA
  ================================================== */

  const runDFA = () => {
    const value =
      testInput.trim();

    const isStringQuestion =
      selectedQuestion.startsWith(
        "string-"
      );

    const isValidInput =
      isStringQuestion
        ? /^[ab]+$/.test(value)
        : /^[01]+$/.test(value);

    if (!isValidInput) {
      setTestResult("invalid");
      setRunning(false);
      setTestStep(0);
      setTestPath([]);

      setMessage(
        isStringQuestion
          ? "Invalid input. Enter only a and b."
          : "Invalid input. Enter only 0 and 1."
      );

      return;
    }

    if (states.length === 0) {
      setTestResult("invalid");

      setMessage(
        "Add at least one state first."
      );

      return;
    }

    const startExists =
      states.some(
        (state) =>
          state.id === startState
      );

    if (!startExists) {
      setTestResult("invalid");

      setMessage(
        "The selected start state no longer exists."
      );

      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (resultTimerRef.current) {
      clearTimeout(
        resultTimerRef.current
      );

      resultTimerRef.current = null;
    }

    setRunning(true);
    setTestResult("");
    setTestStep(0);
    setCurrentState(startState);
    setTestPath([startState]);

    setMessage(
      `DFA started from ${startState}.`
    );

    let step = 0;
    let state = startState;

    timerRef.current =
      setInterval(() => {
        const currentSymbol =
          value[step];

        const transition =
          transitions.find(
            (item) =>
              item.from === state &&
              item.symbol ===
                currentSymbol
          );

        if (!transition) {
          clearInterval(
            timerRef.current
          );

          timerRef.current = null;

          setCurrentState(state);
          setTestStep(step);
          setTestResult("rejected");
          setRunning(false);

          setMessage(
            `No transition from ${state} on input ${currentSymbol}. String rejected.`
          );

          return;
        }

        state = transition.to;

        step++;

        setCurrentState(state);
        setTestStep(step);

        setTestPath((previous) => [
          ...previous,
          state,
        ]);

        setMessage(
          `Read ${currentSymbol}: moved to ${state}.`
        );

        if (step >= value.length) {
          clearInterval(
            timerRef.current
          );

          timerRef.current = null;

          resultTimerRef.current =
            setTimeout(() => {
              const finalState =
                states.find(
                  (item) =>
                    item.id === state
                );

              if (finalState?.isFinal) {
                setTestResult(
                  "accepted"
                );

                setMessage(
                  `Input finished at ${state}. It is a final state.`
                );
              } else {
                setTestResult(
                  "rejected"
                );

                setMessage(
                  `Input finished at ${state}. It is not a final state.`
                );
              }

              setRunning(false);

              resultTimerRef.current =
                null;
            }, 450);
        }
      }, 750);
  };

  /* ==================================================
     STATE POSITION
  ================================================== */

  const getStatePosition = (id) => {
    return states.find(
      (state) => state.id === id
    );
  };

  /* ==================================================
     DEFAULT CONTROL POINT
  ================================================== */

  const getDefaultControlPoint = (
    transition
  ) => {
    const from =
      getStatePosition(
        transition.from
      );

    const to =
      getStatePosition(
        transition.to
      );

    if (!from || !to) {
      return {
        x: 0,
        y: 0,
      };
    }

    if (
      transition.from ===
      transition.to
    ) {
      return {
        x: from.x,
        y: from.y - 115,
      };
    }

    const dx =
      to.x - from.x;

    const dy =
      to.y - from.y;

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );

    if (distance === 0) {
      return {
        x: from.x,
        y: from.y,
      };
    }

    const reverseExists =
      transitions.some(
        (item) =>
          item.id !== transition.id &&
          item.from === transition.to &&
          item.to === transition.from
      );

    const midX =
      (from.x + to.x) / 2;

    const midY =
      (from.y + to.y) / 2;

    if (!reverseExists) {
      return {
        x: midX,
        y: midY,
      };
    }

    const perpendicularX =
      -dy / distance;

    const perpendicularY =
      dx / distance;

    const curveOffset = 90;

    return {
      x:
        midX +
        perpendicularX *
          curveOffset,

      y:
        midY +
        perpendicularY *
          curveOffset,
    };
  };

  /* ==================================================
     CONTROL POINT
  ================================================== */

  const getControlPoint = (
    transition
  ) => {
    if (
      typeof transition.controlX ===
        "number" &&
      typeof transition.controlY ===
        "number"
    ) {
      return {
        x: transition.controlX,
        y: transition.controlY,
      };
    }

    return getDefaultControlPoint(
      transition
    );
  };

  /* ==================================================
     TRANSITION PATH
  ================================================== */

  const getTransitionPath = (
    transition
  ) => {
    const from =
      getStatePosition(
        transition.from
      );

    const to =
      getStatePosition(
        transition.to
      );

    if (!from || !to) {
      return "";
    }

    if (
      transition.from ===
      transition.to
    ) {
      const control =
        getControlPoint(
          transition
        );

      const startX =
        from.x - 28;

      const startY =
        from.y - 45;

      const endX =
        from.x + 28;

      const endY =
        from.y - 45;

      return `
        M ${startX} ${startY}
        Q ${control.x} ${control.y}
          ${endX} ${endY}
      `;
    }

    const dx =
      to.x - from.x;

    const dy =
      to.y - from.y;

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );

    if (distance === 0) {
      return "";
    }

    const ux =
      dx / distance;

    const uy =
      dy / distance;

    const startX =
      from.x +
      ux *
        STATE_RADIUS;

    const startY =
      from.y +
      uy *
        STATE_RADIUS;

    const endX =
      to.x -
      ux *
        STATE_RADIUS;

    const endY =
      to.y -
      uy *
        STATE_RADIUS;

    const control =
      getControlPoint(
        transition
      );

    return `
      M ${startX} ${startY}
      Q ${control.x} ${control.y}
        ${endX} ${endY}
    `;
  };

  /* ==================================================
     TRANSITION LABEL POSITION
  ================================================== */

  const getTransitionLabelPosition = (
    transition
  ) => {
    const from =
      getStatePosition(
        transition.from
      );

    const to =
      getStatePosition(
        transition.to
      );

    if (!from || !to) {
      return {
        x: 0,
        y: 0,
      };
    }

    if (
      transition.from ===
      transition.to
    ) {
      const control =
        getControlPoint(
          transition
        );

      return {
        x: control.x,
        y: control.y + 5,
      };
    }

    const dx =
      to.x - from.x;

    const dy =
      to.y - from.y;

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );

    if (distance === 0) {
      return {
        x: from.x,
        y: from.y,
      };
    }

    const ux =
      dx / distance;

    const uy =
      dy / distance;

    const startX =
      from.x +
      ux *
        STATE_RADIUS;

    const startY =
      from.y +
      uy *
        STATE_RADIUS;

    const endX =
      to.x -
      ux *
        STATE_RADIUS;

    const endY =
      to.y -
      uy *
        STATE_RADIUS;

    const control =
      getControlPoint(
        transition
      );

    return {
      x:
        0.25 * startX +
        0.5 * control.x +
        0.25 * endX,

      y:
        0.25 * startY +
        0.5 * control.y +
        0.25 * endY,
    };
  };

  /* ==================================================
     RENDER
  ================================================== */

  return (
    <main className="simulator-page">

      {/* HERO */}

      <section className="simulator-hero">

        <span className="simulator-tag">
          LEARN BY SIMULATOR
        </span>

        <h1>
          Build Your Own
          <br />
          DFA Simulator
        </h1>

        <p>
          Create a finite automaton on the
          grid, define its transitions,
          and test it with your own
          binary or alphabet strings.
        </p>

      </section>

      {/* QUESTION SELECTOR */}

      <section className="simulator-question-section">

        <div className="question-section-header">

          <div>
            <span>
              CHOOSE YOUR QUESTION
            </span>

            <h2>
              Select a DFA Pattern
            </h2>

            <p>
              Select a question first, then click
              “Load Selected Example” to load
              its related DFA example.
            </p>
          </div>

          <div className="question-count-badge">
            <strong>
              {DFA_QUESTIONS.length}
            </strong>

            <span>
              QUESTIONS
            </span>
          </div>

        </div>

        <div className="simulator-question-grid">

          {DFA_QUESTIONS.map(
            (question) => {

              const isSelected =
                selectedQuestion ===
                question.id;

              return (
                <button
                  key={question.id}
                  className={
                    "simulator-question-card " +
                    (isSelected
                      ? "selected-question"
                      : "")
                  }
                  onClick={() =>
                    selectQuestion(
                      question.id
                    )
                  }
                  disabled={running}
                >

                  <span className="question-number">
                    {question.number}
                  </span>

                  <div className="question-card-content">

                    <h3>
                      {question.title}
                    </h3>

                    <p>
                      {question.description}
                    </p>

                  </div>

                  <span className="question-arrow">
                    {isSelected
                      ? "✓"
                      : "→"}
                  </span>

                </button>
              );
            }
          )}

        </div>

      </section>

      {/* BUILDER */}

      <section className="dfa-builder">

        <div className="builder-header">

          <div>

            <span>
              DFA BUILDER
            </span>

            <h2>
              Design Your Automaton
            </h2>

            <p>
              Add states, connect them with
              transitions, and define the
              accepting states.
            </p>

          </div>

          <div className="builder-actions">

            <button
              className="add-state-button"
              onClick={addState}
              disabled={running}
            >
              + Add New State
            </button>

            <button
              className="add-state-button"
              onClick={loadExampleDFA}
              disabled={running}
            >
              Load Selected Example
            </button>

            <button
              className="clear-button"
              onClick={clearDFA}
              disabled={running}
            >
              Clear DFA
            </button>

          </div>

        </div>

        {/* CANVAS */}

        <div className="dfa-workspace">

          <div className="workspace-topbar">

            <div className="workspace-title">

              <span className="live-dot"></span>

              DFA CANVAS

              <span>
                {states.length} States
              </span>

              <span>
                {transitions.length} Transitions
              </span>

            </div>

            <div className="workspace-message">
              {message}
            </div>

          </div>

          <div className="dfa-grid">

            {/* SVG TRANSITIONS */}

            <svg
              className="transition-layer"
              viewBox={`0 0 ${GRID_WIDTH} ${GRID_HEIGHT}`}
              preserveAspectRatio="none"
            >

              <defs>

                <marker
                  id="dfa-arrow"
                  markerWidth="12"
                  markerHeight="12"
                  refX="10"
                  refY="6"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >

                  <path
                    d="M 0 0 L 12 6 L 0 12 Z"
                  />

                </marker>

              </defs>

              {transitions.map(
                (transition) => {

                  const label =
                    getTransitionLabelPosition(
                      transition
                    );

                  const isActive =
                    running &&
                    testPath.length > 1 &&
                    testPath[
                      testPath.length - 2
                    ] ===
                      transition.from &&
                    testPath[
                      testPath.length - 1
                    ] ===
                      transition.to;

                  return (
                    <g
                      key={transition.id}
                      className={
                        isActive
                          ? "transition-active"
                          : "dfa-transition"
                      }
                    >

                      <path
                        className="transition-path"
                        d={getTransitionPath(
                          transition
                        )}
                        markerEnd="url(#dfa-arrow)"
                      />

                      <g className="transition-label">

                        <rect
                          x={label.x - 15}
                          y={label.y - 15}
                          width="30"
                          height="30"
                          rx="8"
                        />

                        <text
                          x={label.x}
                          y={label.y + 5}
                          textAnchor="middle"
                        >
                          {transition.symbol}
                        </text>

                      </g>

                    </g>
                  );
                }
              )}

            </svg>

            {/* STATES */}

            {states.map((state) => (

              <button
                key={state.id}
                className={
                  "dfa-state " +
                  (
                    selectedState ===
                    state.id
                      ? "selected "
                      : ""
                  ) +
                  (
                    currentState ===
                      state.id &&
                    running
                      ? "running-state "
                      : ""
                  ) +
                  (
                    state.isFinal
                      ? "final-state "
                      : ""
                  ) +
                  (
                    state.isDead
                      ? "dead-state"
                      : ""
                  )
                }
                style={{
                  left:
                    `${(state.x / GRID_WIDTH) * 100}%`,

                  top:
                    `${state.y}px`,

                  transform:
                    "translate(-50%, -50%)",
                }}
                onPointerDown={(event) =>
                  handlePointerDown(
                    event,
                    state.id
                  )
                }
                onClick={() =>
                  selectState(state.id)
                }
                disabled={running}
              >

                {state.isStart && (
                  <span className="start-badge">
                    START
                  </span>
                )}

                <span className="state-circle">

                  <strong>
                    {state.id}
                  </strong>

                  <small>
                    {state.isDead
                      ? "TRAP"
                      : state.isFinal
                      ? "FINAL"
                      : "STATE"}
                  </small>

                </span>

              </button>

            ))}

            {states.length === 0 && (
              <div className="empty-grid">

                <strong>
                  Your DFA canvas is empty
                </strong>

                <p>
                  Click “Add New State”
                  to begin.
                </p>

              </div>
            )}

          </div>

        </div>

        {/* CONTROLS */}

        <div className="builder-controls">

          <div className="control-card">

            <span className="control-number">
              01
            </span>

            <div className="control-main">

              <h3>
                Selected State
              </h3>

              <p>
                Currently selected:
                <strong>
                  {" "}
                  {selectedState}
                </strong>
              </p>

              <div className="control-buttons">

                <button
                  onClick={
                    makeStartState
                  }
                  disabled={running}
                >
                  Make Start
                </button>

                <button
                  onClick={
                    toggleFinalState
                  }
                  disabled={running}
                >
                  {selectedStateObject?.isFinal
                    ? "Remove Final"
                    : "Make Final"}
                </button>

                <button
                  className="dead-button"
                  onClick={
                    toggleTrapState
                  }
                  disabled={running}
                >
                  {selectedStateObject?.isDead
                    ? "Remove Trap"
                    : "Make Trap"}
                </button>

                <button
                  className="danger-button"
                  onClick={
                    deleteState
                  }
                  disabled={
                    running ||
                    selectedState ===
                      startState
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

          <div className="control-card transition-control">

            <span className="control-number">
              02
            </span>

            <div className="control-main">

              <h3>
                Add Transition
              </h3>

              <p>
                Define what happens when
                the DFA reads 0 or 1.
              </p>

              <div className="transition-form">

                <div className="select-group">

                  <label>
                    FROM
                  </label>

                  <select
                    value={fromState}
                    onChange={(event) =>
                      setFromState(
                        event.target.value
                      )
                    }
                    disabled={running}
                  >

                    {states.map(
                      (state) => (
                        <option
                          key={state.id}
                          value={state.id}
                        >
                          {state.id}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <span className="arrow-symbol">
                  →
                </span>

                <div className="select-group">

                  <label>
                    TO
                  </label>

                  <select
                    value={toState}
                    onChange={(event) =>
                      setToState(
                        event.target.value
                      )
                    }
                    disabled={running}
                  >

                    {states.map(
                      (state) => (
                        <option
                          key={state.id}
                          value={state.id}
                        >
                          {state.id}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div className="select-group">

                  <label>
                    INPUT
                  </label>

                  <select
                    value={symbol}
                    onChange={(event) =>
                      setSymbol(
                        event.target.value
                      )
                    }
                    disabled={running}
                  >

                    <option value="0">
                      0
                    </option>

                    <option value="1">
                      1
                    </option>

                    <option value="a">
                      a
                    </option>

                    <option value="b">
                      b
                    </option>

                  </select>

                </div>

                <button
                  className="add-transition-button"
                  onClick={
                    addTransition
                  }
                  disabled={
                    running ||
                    states.length === 0
                  }
                >
                  Add Transition
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* TRANSITION TABLE */}

        <div className="transition-list">

          <div className="section-heading">

            <div>

              <span>
                TRANSITION TABLE
              </span>

              <h3>
                DFA Rules
              </h3>

            </div>

            <span className="transition-count">
              {transitions.length}{" "}
              {transitions.length === 1
                ? "Transition"
                : "Transitions"}
            </span>

          </div>

          {transitions.length === 0 ? (

            <div className="no-transitions">

              <div className="empty-icon">
                →
              </div>

              <strong>
                No transitions yet
              </strong>

              <p>
                Add a transition above
                to define your DFA.
              </p>

            </div>

          ) : (

            <div className="transition-items">

              {transitions.map(
                (transition) => (

                  <div
                    className="transition-item"
                    key={transition.id}
                  >

                    <span>
                      {transition.from}
                    </span>

                    <span className="transition-input">
                      {transition.symbol}
                    </span>

                    <span className="transition-arrow">
                      →
                    </span>

                    <span>
                      {transition.to}
                    </span>

                    <button
                      onClick={() =>
                        deleteTransition(
                          transition.id
                        )
                      }
                      disabled={running}
                      title="Delete transition"
                    >
                      ×
                    </button>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </section>

      {/* TEST SECTION */}

      <section className="dfa-test-section">

        <div className="test-header">

          <div>

            <span>
              TEST YOUR DFA
            </span>

            <h2>
              Run Your Automaton
            </h2>

            <p>
              Your DFA is built. Now enter a
              string and see how it
              moves through the states.
            </p>

          </div>

          <div className="test-badge">

            <strong>
              {states.length}
            </strong>

            States

            <span>•</span>

            <strong>
              {transitions.length}
            </strong>

            Transitions

          </div>

        </div>

        {/* TEST INPUT */}

        <div className="test-input-card">

          <label>
            Enter{" "}
            {selectedQuestion.startsWith(
              "string-"
            )
              ? "Alphabet String"
              : "Binary String"}
          </label>

          <div className="test-input-row">

            <input
              type="text"
              value={testInput}
              onChange={(event) => {
                setTestInput(
                  event.target.value
                );

                setTestResult("");
                setTestStep(0);
                setTestPath([]);

                setCurrentState(
                  startState
                );

                setMessage(
                  "Input changed. Ready to run the DFA."
                );
              }}
              placeholder={
                selectedQuestion.startsWith(
                  "string-"
                )
                  ? "Example: ababa"
                  : "Example: 10101"
              }
              disabled={running}
            />

            <button
              className="run-button"
              onClick={runDFA}
              disabled={running}
            >
              {running
                ? "Running..."
                : "▶ Run DFA"}
            </button>

            <button
              className="test-reset-button"
              onClick={resetTest}
            >
              Reset Test
            </button>

          </div>

          <small>
            {selectedQuestion.startsWith(
              "string-"
            )
              ? "Only a and b are allowed."
              : "Only 0 and 1 are allowed."}
          </small>

        </div>

        {/* EXECUTION */}

        {testInput && (

          <div className="execution-panel">

            <div className="execution-top">

              <div>

                <span>
                  LIVE EXECUTION
                </span>

                <h3>
                  DFA Processing
                </h3>

              </div>

              <div className="execution-step">
                Step {testStep} /{" "}
                {testInput.length}
              </div>

            </div>

            {/* INPUT SYMBOLS */}

            <div className="test-symbols">

              {testInput
                .split("")
                .map(
                  (item, index) => (

                    <div
                      className={
                        "test-symbol " +
                        (
                          index <
                          testStep
                            ? "done"
                            : index ===
                              testStep
                            ? "active"
                            : ""
                        )
                      }
                      key={index}
                    >
                      {item}
                    </div>

                  )
                )}

            </div>

            {/* CURRENT STATE */}

            <div className="execution-state">

              <span>
                CURRENT STATE
              </span>

              <strong>
                {currentState}
              </strong>

              {testPath.length > 0 && (

                <div className="path-display">

                  {testPath.map(
                    (state, index) => (

                      <span
                        key={`${state}-${index}`}
                      >

                        {state}

                        {index <
                          testPath.length - 1 && (
                          <b>
                            →
                          </b>
                        )}

                      </span>

                    )
                  )}

                </div>

              )}

            </div>

            {/* RESULT */}

            {testResult && (

              <div
                className={
                  "test-result " +
                  testResult
                }
              >

                <div className="test-result-icon">

                  {testResult ===
                  "accepted"
                    ? "✓"
                    : testResult ===
                      "rejected"
                    ? "×"
                    : "!"}

                </div>

                <div>

                  <h3>

                    {testResult ===
                    "accepted"
                      ? "String Accepted"
                      : testResult ===
                        "rejected"
                      ? "String Rejected"
                      : "Invalid Input"}

                  </h3>

                  <p>
                    {message}
                  </p>

                </div>

              </div>

            )}

          </div>

        )}

      </section>

      {/* HOW IT WORKS */}

      <section className="simulator-info">

        <h3>
          How the DFA Builder Works
        </h3>

        <div className="info-grid">

          <div className="info-item">

            <strong>
              1
            </strong>

            <h4>
              Add States
            </h4>

            <p>
              Create states and place them
              anywhere on the grid.
            </p>

          </div>

          <div className="info-item">

            <strong>
              2
            </strong>

            <h4>
              Define States
            </h4>

            <p>
              Select a state and mark it
              as Start, Final, or Trap.
            </p>

          </div>

          <div className="info-item">

            <strong>
              3
            </strong>

            <h4>
              Add Transitions
            </h4>

            <p>
              Connect states using
              input 0 or input 1.
            </p>

          </div>

          <div className="info-item">

            <strong>
              4
            </strong>

            <h4>
              Run & Test
            </h4>

            <p>
              Enter a string and watch
              the DFA process it.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Simulator;