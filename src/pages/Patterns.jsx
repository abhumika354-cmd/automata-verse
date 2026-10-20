import { useState } from "react";
import "../styles/Patterns.css";

const questions = [
  {
    id: "endsWith1",
    title: "Ends with 1",
    description: "Accept binary strings that end with 1.",
    alphabet: "0, 1",
    example: "10101",
  },
  {
    id: "endsWith0",
    title: "Ends with 0",
    description: "Accept binary strings that end with 0.",
    alphabet: "0, 1",
    example: "10100",
  },
  {
    id: "startsWith1",
    title: "Starts with 1",
    description: "Accept binary strings that start with 1.",
    alphabet: "0, 1",
    example: "10101",
  },
  {
    id: "startsWith0",
    title: "Starts with 0",
    description: "Accept binary strings that start with 0.",
    alphabet: "0, 1",
    example: "01011",
  },
  {
    id: "contains01",
    title: "Contains 01",
    description: "Accept binary strings containing the pattern 01.",
    alphabet: "0, 1",
    example: "11010",
  },
  {
    id: "contains10",
    title: "Contains 10",
    description: "Accept binary strings containing the pattern 10.",
    alphabet: "0, 1",
    example: "00101",
  },
  {
    id: "evenZeros",
    title: "Even Number of 0s",
    description: "Accept binary strings containing an even number of 0s.",
    alphabet: "0, 1",
    example: "00110",
  },
  {
    id: "evenOnes",
    title: "Even Number of 1s",
    description: "Accept binary strings containing an even number of 1s.",
    alphabet: "0, 1",
    example: "11010",
  },
  {
    id: "endsWithA",
    title: "Ends with a",
    description: "Accept strings over {a,b} that end with a.",
    alphabet: "a, b",
    example: "ababa",
  },
  {
    id: "startsWithA",
    title: "Starts with a",
    description: "Accept strings over {a,b} that start with a.",
    alphabet: "a, b",
    example: "aabba",
  },
  {
    id: "containsAB",
    title: "Contains ab",
    description: "Accept strings over {a,b} containing the pattern ab.",
    alphabet: "a, b",
    example: "aababa",
  },
  {
    id: "evenAs",
    title: "Even Number of a's",
    description: "Accept strings over {a,b} containing an even number of a's.",
    alphabet: "a, b",
    example: "aabb",
  },
];

const stringQuestionIds = [
  "endsWithA",
  "startsWithA",
  "containsAB",
  "evenAs",
];

const explanations = {
  endsWith1: {
    title: "Checking the last symbol",
    description:
      "The DFA remembers the last symbol read. Reading 1 moves to q1, while reading 0 moves to q0.",
    stateMeaning:
      "q0 = string ends with 0, or no symbol has been read | q1 = string ends with 1",
  },
  endsWith0: {
    title: "Checking the last symbol",
    description:
      "The DFA remembers the last symbol read. Reading 0 moves to q1, while reading 1 moves to q0.",
    stateMeaning:
      "q0 = string ends with 1, or no symbol has been read | q1 = string ends with 0",
  },
  startsWith1: {
    title: "Checking the first symbol",
    description:
      "The first symbol decides the result. The DFA enters q1 if it starts with 1 and q2 if it starts with 0. Both states remain unchanged afterward.",
    stateMeaning:
      "q0 = start | q1 = starts with 1 | q2 = does not start with 1",
  },
  startsWith0: {
    title: "Checking the first symbol",
    description:
      "The first symbol decides the result. The DFA enters q1 if it starts with 0 and q2 if it starts with 1. Both states remain unchanged afterward.",
    stateMeaning:
      "q0 = start | q1 = starts with 0 | q2 = does not start with 0",
  },
  contains01: {
    title: "Searching for pattern 01",
    description:
      "The DFA remembers when it has seen a 0. If the next relevant symbol is 1, it enters q2 and keeps accepting the pattern.",
    stateMeaning:
      "q0 = waiting for 0 | q1 = saw 0, waiting for 1 | q2 = found 01",
  },
  contains10: {
    title: "Searching for pattern 10",
    description:
      "The DFA remembers when it has seen a 1. If the next relevant symbol is 0, it enters q2 and keeps accepting the pattern.",
    stateMeaning:
      "q0 = waiting for 1 | q1 = saw 1, waiting for 0 | q2 = found 10",
  },
  evenZeros: {
    title: "Checking the number of 0s",
    description:
      "Each 0 switches the DFA between even and odd states. Reading 1 does not change the count of zeros.",
    stateMeaning:
      "q0 = even number of 0s | q1 = odd number of 0s",
  },
  evenOnes: {
    title: "Checking the number of 1s",
    description:
      "Each 1 switches the DFA between even and odd states. Reading 0 does not change the count of ones.",
    stateMeaning:
      "q0 = even number of 1s | q1 = odd number of 1s",
  },
  endsWithA: {
    title: "Checking the last symbol",
    description:
      "The DFA remembers the last symbol read. Reading a moves to q1, while reading b moves to q0.",
    stateMeaning:
      "q0 = string ends with b, or no symbol has been read | q1 = string ends with a",
  },
  startsWithA: {
    title: "Checking the first symbol",
    description:
      "The first symbol decides the result. The DFA enters q1 if it starts with a and q2 if it starts with b. Both states remain unchanged afterward.",
    stateMeaning:
      "q0 = start | q1 = starts with a | q2 = does not start with a",
  },
  containsAB: {
    title: "Searching for pattern ab",
    description:
      "The DFA remembers when it has seen a. Reading b next completes the pattern ab and moves it to q2.",
    stateMeaning:
      "q0 = waiting for a | q1 = saw a, waiting for b | q2 = found ab",
  },
  evenAs: {
    title: "Checking the number of a's",
    description:
      "Each a switches the DFA between even and odd states. Reading b does not change the count of a's.",
    stateMeaning:
      "q0 = even number of a's | q1 = odd number of a's",
  },
};

function checkAnswer(value, questionId) {
  switch (questionId) {
    case "endsWith1":
      return value.endsWith("1");
    case "endsWith0":
      return value.endsWith("0");
    case "startsWith1":
      return value.startsWith("1");
    case "startsWith0":
      return value.startsWith("0");
    case "contains01":
      return value.includes("01");
    case "contains10":
      return value.includes("10");
    case "evenZeros":
      return [...value].filter((char) => char === "0").length % 2 === 0;
    case "evenOnes":
      return [...value].filter((char) => char === "1").length % 2 === 0;
    case "endsWithA":
      return value.endsWith("a");
    case "startsWithA":
      return value.startsWith("a");
    case "containsAB":
      return value.includes("ab");
    case "evenAs":
      return [...value].filter((char) => char === "a").length % 2 === 0;
    default:
      return false;
  }
}

/*
 * Returns the state reached after reading each symbol.
 * q0 is the initial state for all questions.
 */
function getDFAStates(value, questionId) {
  const trace = [{ symbol: "START", state: "q0" }];
  let state = "q0";

  for (let index = 0; index < value.length; index++) {
    const symbol = value[index];

    switch (questionId) {
      case "endsWith1":
        state = symbol === "1" ? "q1" : "q0";
        break;

      case "endsWith0":
        state = symbol === "0" ? "q1" : "q0";
        break;

      case "startsWith1":
        if (index === 0) {
          state = symbol === "1" ? "q1" : "q2";
        }
        break;

      case "startsWith0":
        if (index === 0) {
          state = symbol === "0" ? "q1" : "q2";
        }
        break;

      case "startsWithA":
        if (index === 0) {
          state = symbol === "a" ? "q1" : "q2";
        }
        break;

      case "contains01":
        if (state === "q0") {
          state = symbol === "0" ? "q1" : "q0";
        } else if (state === "q1") {
          if (symbol === "1") {
            state = "q2";
          } else {
            state = "q1";
          }
        }
        break;

      case "contains10":
        if (state === "q0") {
          state = symbol === "1" ? "q1" : "q0";
        } else if (state === "q1") {
          if (symbol === "0") {
            state = "q2";
          } else {
            state = "q1";
          }
        }
        break;

      case "containsAB":
        if (state === "q0") {
          state = symbol === "a" ? "q1" : "q0";
        } else if (state === "q1") {
          if (symbol === "b") {
            state = "q2";
          } else {
            state = "q1";
          }
        }
        break;

      case "evenZeros":
        if (symbol === "0") {
          state = state === "q0" ? "q1" : "q0";
        }
        break;

      case "evenOnes":
        if (symbol === "1") {
          state = state === "q0" ? "q1" : "q0";
        }
        break;

      case "endsWithA":
        state = symbol === "a" ? "q1" : "q0";
        break;

      case "evenAs":
        if (symbol === "a") {
          state = state === "q0" ? "q1" : "q0";
        }
        break;

      default:
        break;
    }

    trace.push({ symbol, state });
  }

  return trace;
}

function getDynamicExplanation(questionId, input, result, finalState) {
  const selected = explanations[questionId];

  let decision =
    "Enter a string using the selected alphabet and click Analyze Pattern to see the DFA decision.";

  if (result === "accepted") {
    decision = `The input "${input}" finished in ${finalState}. The selected rule is satisfied, so the string is ACCEPTED.`;
  } else if (result === "rejected") {
    decision = `The input "${input}" finished in ${finalState}. The selected rule is not satisfied, so the string is REJECTED.`;
  } else if (result === "invalid") {
    decision = "The input is invalid. Use only the symbols from the selected alphabet.";
  }

  return {
    ...selected,
    decision,
  };
}

function Patterns() {
  const [selectedQuestion, setSelectedQuestion] = useState("endsWith1");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [dfaStates, setDfaStates] = useState([]);

  const currentQuestion = questions.find(
    (question) => question.id === selectedQuestion
  );

  const isStringQuestion = stringQuestionIds.includes(selectedQuestion);
  const inputLabel = isStringQuestion ? "Enter String" : "Enter Binary String";
  const inputPlaceholder = currentQuestion.example;

  const finalState =
    dfaStates.length > 0
      ? dfaStates[dfaStates.length - 1].state
      : "q0";

  const dynamicExplanation = getDynamicExplanation(
    selectedQuestion,
    input.trim(),
    result,
    finalState
  );

  const analyzePattern = () => {
    const value = input.trim();
    const validPattern = isStringQuestion ? /^[ab]+$/ : /^[01]+$/;

    if (!validPattern.test(value)) {
      setResult("invalid");
      setDfaStates([]);
      return;
    }

    const accepted = checkAnswer(value, selectedQuestion);
    const states = getDFAStates(value, selectedQuestion);

    setDfaStates(states);
    setResult(accepted ? "accepted" : "rejected");
  };

  const handleQuestionChange = (questionId) => {
    setSelectedQuestion(questionId);
    setInput("");
    setResult("");
    setDfaStates([]);
  };

  const clearAll = () => {
    setInput("");
    setResult("");
    setDfaStates([]);
  };

  return (
    <main className="patterns-page">
      <section className="patterns-hero">
        <div className="patterns-hero-content">
          <span className="patterns-tag">
            LEARN WHILE OBSERVING PATTERNS
          </span>

          <h1>
            Understand Automata
            <span>Through Patterns.</span>
          </h1>

          <p>
            Choose an automata question, enter a string using its alphabet,
            and observe how the DFA processes every symbol before deciding
            whether the string is accepted or rejected.
          </p>

          <div className="patterns-hero-tags">
            <span>DFA</span>
            <span>0 / 1 STRINGS</span>
            <span>A / B STRINGS</span>
            <span>REGULAR LANGUAGE</span>
          </div>
        </div>

        <div className="dfa-preview">
          <div className="dfa-preview-top">
            <span>DFA PATTERN ANALYZER</span>
            <span className="dfa-live">● ACTIVE</span>
          </div>

          <div className="dfa-machine">
            <div className="dfa-line line-a"></div>
            <div className="dfa-line line-b"></div>

            <div className="dfa-state dfa-q0">
              <strong>q0</strong>
              <small>START</small>
            </div>

            <div className="dfa-state dfa-q1">
              <strong>q1</strong>
              <small>STATE</small>
            </div>

            <div className="dfa-arrow arrow-one">
              <span>0 / 1</span>
              →
            </div>

            <div className="dfa-arrow arrow-two">
              <span>0 / 1</span>
              →
            </div>
          </div>

          <div className="dfa-preview-footer">
            <span>QUESTION BASED DFA</span>
            <span>STATE TRANSITIONS</span>
          </div>
        </div>
      </section>

      <section className="question-section">
        <div className="question-heading">
          <div>
            <span className="card-label">AUTOMATA QUESTION BUILDER</span>
            <h2>Choose Your Question</h2>
            <p>
              Select what you want the DFA to check. Each question uses a
              different pattern rule.
            </p>
          </div>

          <div className="question-count">
            <strong>{questions.length}</strong>
            <span>QUESTIONS</span>
          </div>
        </div>

        <div className="question-grid">
          {questions.map((question, index) => (
            <button
              type="button"
              key={question.id}
              className={`question-option ${
                selectedQuestion === question.id ? "selected" : ""
              }`}
              onClick={() => handleQuestionChange(question.id)}
              aria-pressed={selectedQuestion === question.id}
            >
              <div className="question-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="question-info">
                <strong>{question.title}</strong>
                <span>{question.description}</span>
              </div>

              <div className="question-check">
                {selectedQuestion === question.id ? "✓" : "→"}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="pattern-card">
        <div className="pattern-card-header">
          <div>
            <span className="card-label">DFA SIMULATION</span>
            <h2>Test Your String</h2>
            <p>
              <strong>Question:</strong> {currentQuestion.description}
            </p>
          </div>

          <div className="rule-box">
            <span>SELECTED RULE</span>
            <strong>{currentQuestion.title}</strong>
          </div>
        </div>

        <div className="pattern-input-area">
          <label htmlFor="pattern-input">{inputLabel}</label>

          <div className="input-row">
            <div className="input-wrapper">
              <span className="input-prefix">&gt;</span>
              <input
                id="pattern-input"
                type="text"
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  setResult("");
                  setDfaStates([]);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    analyzePattern();
                  }
                }}
                placeholder={`Example: ${inputPlaceholder}`}
                autoComplete="off"
                spellCheck="false"
                aria-describedby="pattern-input-help"
              />
            </div>

            <button
              type="button"
              className="analyze-button"
              onClick={analyzePattern}
            >
              Analyze Pattern →
            </button>

            <button
              type="button"
              className="clear-button"
              onClick={clearAll}
            >
              Clear
            </button>
          </div>

          <div className="input-help" id="pattern-input-help">
            <span>●</span>
            Only <strong>{currentQuestion.alphabet}</strong> are allowed.
            Press Enter to analyze.
          </div>
        </div>
      </section>

      {result && (
        <section
          className={`pattern-result ${result}`}
          aria-live="polite"
        >
          <div className="result-icon">
            {result === "accepted" ? "✓" : result === "rejected" ? "×" : "!"}
          </div>

          <div className="result-content">
            <span className="result-label">DFA RESULT</span>

            <h3>
              {result === "accepted"
                ? "String Accepted"
                : result === "rejected"
                ? "String Rejected"
                : "Invalid Input"}
            </h3>

            <p>
              {result === "accepted"
                ? `The string satisfies the selected rule: ${currentQuestion.title}.`
                : result === "rejected"
                ? `The string does not satisfy the selected rule: ${currentQuestion.title}.`
                : `Please enter a non-empty string using only ${currentQuestion.alphabet}.`}
            </p>
          </div>

          <div className="result-state">
            {result === "accepted" ? "✓" : result === "rejected" ? "×" : "—"}
          </div>
        </section>
      )}

      <section className="dfa-learning-section">
        <div className="learning-card">
          <div className="learning-icon">DFA</div>

          <div className="learning-content">
            <span className="card-label">AUTOMATA CONCEPT</span>
            <h3>What is happening here?</h3>
            <p>{dynamicExplanation.description}</p>
          </div>
        </div>

        {dfaStates.length > 0 && result !== "invalid" && (
          <div className="dfa-process-card">
            <div className="process-header">
              <div>
                <span className="card-label">LIVE DFA TRACE</span>
                <h3>State-by-State Processing</h3>
              </div>

              <div className="process-question">{currentQuestion.title}</div>
            </div>

            <div className="dfa-trace">
              {dfaStates.map((item, index) => (
                <div
                  className="dfa-trace-step"
                  key={`${item.symbol}-${index}`}
                >
                  <div className="trace-state">
                    <strong>{item.state}</strong>
                    <span>
                      {index === 0
                        ? "START"
                        : index === dfaStates.length - 1
                        ? "FINAL STATE"
                        : "CURRENT STATE"}
                    </span>
                  </div>

                  {index < dfaStates.length - 1 && (
                    <div className="trace-arrow">
                      <span>{dfaStates[index + 1].symbol}</span>
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="trace-summary">
              <div>
                <span>INPUT</span>
                <strong>{input.trim()}</strong>
              </div>

              <div>
                <span>FINAL STATE</span>
                <strong>{finalState}</strong>
              </div>

              <div>
                <span>DECISION</span>
                <strong
                  className={
                    result === "accepted" ? "accepted-text" : "rejected-text"
                  }
                >
                  {result === "accepted" ? "ACCEPTED" : "REJECTED"}
                </strong>
              </div>
            </div>
          </div>
        )}

        <div className="state-explanation">
          <div className="state-box">
            <span className="state-number">01</span>
            <div>
              <strong>{finalState}</strong>
              <p>{dynamicExplanation.stateMeaning}</p>
            </div>
          </div>

          <div className="state-connector">→</div>

          <div className="state-box final-state-box">
            <span className="state-number">02</span>
            <div>
              <strong>Decision</strong>
              <p>{dynamicExplanation.decision}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="patterns-bottom">
        <span>OBSERVE • ANALYZE • UNDERSTAND</span>
        <h2>
          Every Pattern
          <br />
          Tells a Story.
        </h2>
        <p>
          Select different automata questions and observe how the DFA changes
          its states for different input strings and alphabets.
        </p>
      </section>
    </main>
  );
}

export default Patterns;
