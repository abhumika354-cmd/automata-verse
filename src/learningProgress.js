const STORAGE_KEY = "automataVerseLearningProgress";

export const LEARNING_LESSONS = [
  {
    id: "lesson-1",
    title: "Introduction to Automata",
    topic: "Finite machines and automata basics",
    summary: "Learn how an automaton reads a sequence of symbols and moves between states by following explicit rules.",
    points: ["An input alphabet is the set of symbols a machine can read.", "A state represents the machine's current condition.", "The machine starts in a start state and processes symbols one at a time."],
    details: "A computation begins at the start state and consumes the input string from left to right. After every symbol, the current state may change. When no symbols remain, the result depends on whether the machine is in an accepting state.",
    example: "For input \"101\", read 1, 0, and 1 in that order. State q0 -> q1 -> q0 -> q1 shows a complete computation.",
    practice: "Write the states and transitions needed to accept every binary string that ends in 1.",
  },
  {
    id: "lesson-2",
    title: "Finite State Machines",
    topic: "States, inputs, transitions and outputs",
    summary: "Finite state machines use a limited set of states and transitions to model behavior such as menus, games and validation flows.",
    points: ["State changes are triggered by an input symbol.", "Every transition has a source state and a destination state.", "AutomataVerse uses states to visualize how an input is processed."],
    details: "A transition table or state diagram describes exactly what happens for every state and input pair. FSMs are useful for user flows, passwords, vending machines and protocols because they make allowed behavior explicit.",
    example: "A two-state login machine can move from \"Logged out\" to \"Logged in\" only after a valid username and password.",
    practice: "Design three states for a traffic light: Red, Yellow and Green. Add only the valid next-state transitions.",
  },
  {
    id: "lesson-3",
    title: "Deterministic Finite Automata",
    topic: "One transition for every input symbol",
    summary: "A DFA always takes exactly one transition for a given state and input symbol, making its result predictable.",
    points: ["There is only one start state.", "Each state has one transition for every symbol in the alphabet.", "A string is accepted only if processing ends in a final state."],
    details: "The deterministic property means that a string can never take two competing paths. The DFA can therefore be traced with a simple table: choose the row for the current state, choose the column for the next symbol, and continue.",
    example: "If q0 has transitions q0 --0--> q0 and q0 --1--> q1, the symbol 1 changes state while 0 keeps the machine in q0.",
    practice: "Create a DFA over {0,1} that accepts strings containing at least one 1.",
  },
  {
    id: "lesson-4",
    title: "DFA State Diagrams",
    topic: "Reading and drawing automata diagrams",
    summary: "State diagrams show states as circles and transitions as arrows, so you can trace strings without writing source code.",
    points: ["An arrow marked 'start' identifies q0.", "A double circle marks an accepting state.", "Arrow labels show which input symbol causes a transition."],
    details: "Drawing a DFA starts with naming states that represent useful information, selecting a start state and marking accepting states. Labels on arrows indicate the symbol that performs each change.",
    example: "Draw q0 and q1 for strings ending in 0 and 1. On 1, q0 and q1 lead to q1; on 0, both lead to q0.",
    practice: "Draw a DFA for strings of length exactly three over {a,b}.",
  },
  {
    id: "lesson-5",
    title: "Regular Languages",
    topic: "Languages recognized by finite automata",
    summary: "A regular language is a collection of strings accepted by a finite automaton or described by a regular expression.",
    points: ["The language contains all strings accepted by the DFA.", "A pattern can be tested by tracing every input symbol.", "Rejected strings do not belong to the language."],
    details: "The alphabet defines available symbols, but the language is only the subset of strings accepted by the DFA. The machine may reject infinitely many strings while accepting infinitely many others.",
    example: "The DFA that accepts strings ending in 1 accepts \"1\", \"01\" and \"111\", but rejects \"\", \"0\" and \"10\".",
    practice: "Describe the language for a DFA with q0 as the start state and q1 as the only accepting state.",
  },
  {
    id: "lesson-6",
    title: "Binary Pattern Validation",
    topic: "Building patterns for AutomataVerse",
    summary: "Practice binary strings from the alphabet {0,1}, such as strings that end with 1 or contain an even number of 1s.",
    points: ["Define the accepted and rejected examples first.", "Create states that remember the pattern needed so far.", "Trace edge cases such as an empty string and single-symbol strings."],
    details: "Choose states according to the information needed to decide acceptance in the future. For an \"even number of 1s\" language, two states are enough: one for even parity and one for odd parity.",
    example: "Process \"1011\": start even -> odd -> even -> odd -> even. The final state is accepting.",
    practice: "Build a two-state DFA that accepts binary strings with an even number of 1s.",
  },
  {
    id: "lesson-7",
    title: "NFA and Epsilon Moves",
    topic: "Multiple paths and epsilon transitions",
    summary: "An NFA may take multiple paths for one input symbol, while epsilon moves allow it to change state without reading a symbol.",
    points: ["An NFA can have more than one transition for a symbol.", "Epsilon means 'move without consuming input'.", "NFAs can be converted into equivalent DFAs."],
    details: "An NFA accepts a string if at least one possible path reaches an accepting state. Epsilon transitions add branches without consuming a symbol and are often used to combine sub-patterns.",
    example: "An NFA for strings containing 10 can move through 1 and 0 while the DFA would track whether each required prefix has appeared.",
    practice: "Draw an NFA with epsilon moves that accepts either \"ab\" or \"ac\".",
  },
  {
    id: "lesson-8",
    title: "Automata for DFA Challenges",
    topic: "Decode, fix and build challenge workflows",
    summary: "AutomataVerse challenge modes test whether you can interpret a diagram, repair a transition and build an accepting machine.",
    points: ["Decode questions ask you to identify the accepted language.", "Fix questions require correcting states or transitions.", "Build questions ask you to construct the requested DFA."],
    details: "Decode a machine by tracing short accepted and rejected examples. Fix mode is safer after identifying every incorrect transition. Build mode starts by defining states, alphabet and acceptance behavior.",
    example: "If a machine accepts 00 but rejects 01, compare the transition taken after 0 and identify the destination state that differs.",
    practice: "Take the next challenge and state why each answer string is accepted or rejected before submitting.",
  },
  {
    id: "lesson-9",
    title: "Automata Simulator",
    topic: "Tracing input strings through DFA states",
    summary: "Use the simulator to enter a string and follow each transition so you can see why a DFA accepts or rejects it.",
    points: ["Enter a string made only from the defined alphabet.", "Start tracing from q0.", "The final state determines whether the string is accepted."],
    details: "Tracing should produce a state sequence, not only an accept/reject answer. If a string is rejected unexpectedly, locate the first transition that differs from the intended language.",
    example: "For 010 and q0 -> q1 on 0 -> q0 on 1 -> q1 on 0, the sequence is q0, q1, q0, q1.",
    practice: "Use the simulator to trace \"001\" and explain why the machine reaches an accepting or rejecting state.",
  },
  {
    id: "lesson-10",
    title: "Automata Project Recap",
    topic: "Connect theory with the complete project",
    summary: "Review the complete journey from automata theory to the learning dashboard, challenge engine and DFA simulator.",
    points: ["Patterns demonstrate regular-language behavior.", "Challenges test decoding, fixing and building skills.", "The simulator makes abstract state transitions easy to visualize."],
    details: "The project turns formal concepts into three interactive experiences: learn the idea, practice it in challenges and verify it in the simulator. State diagrams, acceptance rules and input tracing all appear at different stages.",
    example: "A lesson introduces even parity, a challenge tests it with unseen strings and the simulator traces a specific example.",
    practice: "Explain how one project feature could be improved using states and transitions.",
  },
  {
    id: "lesson-11",
    title: "Pumping Lemma for Regular Languages",
    topic: "The pumping condition and proving languages non-regular",
    summary: "Use the pumping lemma to show that some languages cannot be recognized by any finite automaton.",
    points: [
      "If L is regular, there is a pumping length p such that every s ∈ L with |s| ≥ p can be split into s = xyz.",
      "The split must satisfy |xy| ≤ p and |y| ≥ 1, so y is a nonempty part of the first p symbols.",
      "For every i ≥ 0, xy^i z ∈ L. The lemma is a necessary property of regular languages and is commonly used to prove a language is not regular.",
    ],
    details: "To apply the lemma, assume the language is regular and take its pumping length p. Choose a string in the language at least p symbols long. The lemma says every valid split has a nonempty middle part y among the first p symbols. Pump y (often by choosing i = 0) and show the resulting string cannot belong to the language. This contradiction proves the original assumption was false.",
    example: "Consider L = {0^n1^n | n ≥ 0}. Assume L is regular with pumping length p and choose s = 0^p1^p. Since |xy| ≤ p and |y| ≥ 1, y contains only zeros; write y = 0^k for 1 ≤ k ≤ p. Pump down with i = 0: xz = 0^(p-k)1^p, which has fewer zeros than ones and is not in L. Therefore L is not regular.",
    practice: "Apply the pumping lemma to explain why {0^n1^n | n ≥ 0} cannot be recognized by a DFA. Identify the chosen string and the pumped part.",
  },
  {
    id: "lesson-12",
    title: "Minimization of a DFA",
    topic: "Removing unreachable states and merging equivalent states",
    summary: "Find an equivalent DFA with the fewest possible states while preserving exactly the same accepted language.",
    points: [
      "Remove unreachable states because no input from the start state can visit them.",
      "States are equivalent when every possible remaining input suffix leads to the same accept/reject result from both states.",
      "Start with accepting and non-accepting groups, then repeatedly split groups when transitions lead to different groups. Merge states left in the same group.",
    ],
    details: "DFA minimization preserves the language, not necessarily the original state names or layout. After removing unreachable states, partition the states into accepting and non-accepting sets. Refine the partition whenever two states in one set transition into different sets for some symbol. When no more splits are needed, each group becomes one state in the minimal DFA.",
    example: "Build a DFA for binary strings ending in 1 with A as the start state, B meaning the last symbol was 0, and C meaning the last symbol was 1 (the only accepting state). From every state, 0 goes to B and 1 goes to C. A and B are equivalent: both are non-accepting, both go to B on 0, and both go to C on 1. Merge A and B into a non-accepting state; keep C accepting. The resulting two-state DFA still accepts exactly the strings ending in 1.",
    practice: "For the three-state DFA in the example, write the two transition rows after merging A and B, and test the strings 101 and 100.",
  },
  {
    id: "lesson-13",
    title: "Turing Machines",
    topic: "Tape, read/write head, transitions and computation",
    summary: "Explore a general model of computation that reads and writes tape symbols while moving a head between tape cells.",
    points: [
      "A Turing machine has a finite control, a tape, and a head that reads and writes one cell at a time.",
      "A transition uses the current state and tape symbol to choose a new state, a symbol to write, and a move left or right.",
      "A common formal definition is M = (Q, Σ, Γ, δ, q₀, q_accept, q_reject), where Γ includes the blank symbol and Σ is the input alphabet.",
      "A machine may accept, reject, or run forever; unlike a finite automaton, its tape provides unbounded working memory.",
    ],
    details: "The input is placed on the tape and the head starts at its first symbol in the start state. At each step, the transition function δ determines what to write, which direction to move, and which state to enter. The computation ends if it reaches an accept or reject state; some machines do not halt for every input.",
    example: "A unary increment machine adds one mark to an input such as 111. In a scan state, use δ(q_scan, 1) = (q_scan, 1, R) to move right over each 1. When the head reaches the blank, use δ(q_scan, blank) = (q_accept, 1, R). The tape now contains 1111, representing 4.",
    practice: "Trace the unary increment machine on input 11. Record the head position and state until it reaches the blank, then write the final tape contents.",
  },
  {
    id: "lesson-14",
    title: "Chomsky Hierarchy of Languages",
    topic: "Four language classes, grammar types and machine models",
    summary: "Compare language classes by the restrictions on their grammars and the computational models that recognize them.",
    points: [
      "Type 3: regular languages use regular grammars and are recognized by finite automata.",
      "Type 2: context-free languages use context-free grammars and are recognized by pushdown automata.",
      "Type 1: context-sensitive languages use context-sensitive grammars and are recognized by linear-bounded automata.",
      "Type 0: recursively enumerable languages use unrestricted grammars and are recognized by Turing machines.",
      "The classes are nested: Regular ⊊ Context-free ⊊ Context-sensitive ⊊ Recursively enumerable. Each inclusion is strict.",
    ],
    details: "The hierarchy organizes languages from the most restricted grammar rules to unrestricted rules. In a Type 3 regular grammar, productions are right-linear (with the usual equivalent left-linear form). Type 2 productions have a single nonterminal on the left. Type 1 productions are non-contracting, apart from the standard start-symbol exception for the empty string. Type 0 grammars have no such restriction. A more powerful grammar or machine can describe a broader class, but cannot make every language decidable.",
    example: "Representative examples are (ab)* for Type 3; {a^n b^n | n ≥ 0} for Type 2 (context-free but not regular); {a^n b^n c^n | n ≥ 1} for Type 1 (context-sensitive but not context-free); and HALT = {⟨M,w⟩ | machine M halts on input w} for Type 0. HALT is recognizable by a Turing machine, but it is not decidable.",
    practice: "Match each example to its smallest Chomsky class: (ab)*, {a^n b^n | n ≥ 0}, and {a^n b^n c^n | n ≥ 1}. Name the machine model for each class.",
  },
];

function emptyProgress() {
  return {
    completedLessonIds: [],
    solvedChallengeIds: [],
    challengeAttempts: 0,
    challengeCorrect: 0,
    learningSeconds: 0,
    activityDates: [],
    experiencePoints: 0,
  };
}

function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function readLearningProgress() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return emptyProgress();
  }

  const parsed = JSON.parse(saved);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Saved learning progress has an invalid format.");
  }

  const progress = { ...emptyProgress(), ...parsed };
  progress.completedLessonIds = progress.completedLessonIds.map((id) =>
    id === "automata-basics" ? "lesson-1" : id
  ).filter((id, index, ids) => ids.indexOf(id) === index);
  const counts = [
    progress.challengeAttempts,
    progress.challengeCorrect,
    progress.learningSeconds,
    progress.experiencePoints,
  ];

  if (
    !Array.isArray(progress.completedLessonIds) ||
    !Array.isArray(progress.solvedChallengeIds) ||
    !Array.isArray(progress.activityDates) ||
    !progress.completedLessonIds.every((id) => typeof id === "string") ||
    !progress.solvedChallengeIds.every((id) => typeof id === "string") ||
    !progress.activityDates.every((date) => typeof date === "string") ||
    !counts.every((count) => Number.isSafeInteger(count) && count >= 0) ||
    progress.challengeCorrect > progress.challengeAttempts
  ) {
    throw new Error("Saved learning progress has an invalid format.");
  }

  return progress;
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event("learning-progress-updated"));
  return progress;
}

function withActivityToday(progress) {
  const today = getTodayKey();

  if (progress.activityDates.includes(today)) {
    return progress.activityDates;
  }

  return [...progress.activityDates, today].slice(-365);
}

export function recordLearningSeconds(seconds) {
  const elapsed = Math.floor(seconds);

  if (elapsed < 1) {
    return readLearningProgress();
  }

  const progress = readLearningProgress();

  return saveProgress({
    ...progress,
    learningSeconds: progress.learningSeconds + elapsed,
    activityDates: withActivityToday(progress),
  });
}

export function resetLearningProgress() {
  return saveProgress(emptyProgress());
}

export function completeLesson(lessonId) {
  const progress = readLearningProgress();

  if (progress.completedLessonIds.includes(lessonId)) {
    return progress;
  }

  return saveProgress({
    ...progress,
    completedLessonIds: [...progress.completedLessonIds, lessonId],
    activityDates: withActivityToday(progress),
    experiencePoints: progress.experiencePoints + 50,
  });
}

export function markLessonUnread(lessonId) {
  const progress = readLearningProgress();

  if (!progress.completedLessonIds.includes(lessonId)) {
    return progress;
  }

  return saveProgress({
    ...progress,
    completedLessonIds: progress.completedLessonIds.filter((id) => id !== lessonId),
    experiencePoints: Math.max(0, progress.experiencePoints - 50),
  });
}

export function recordChallengeAttempt(challengeId, isCorrect) {
  const progress = readLearningProgress();
  const alreadySolved = progress.solvedChallengeIds.includes(challengeId);
  const solvedChallengeIds =
    isCorrect && !alreadySolved
      ? [...progress.solvedChallengeIds, challengeId]
      : progress.solvedChallengeIds;

  return saveProgress({
    ...progress,
    challengeAttempts: progress.challengeAttempts + 1,
    challengeCorrect: progress.challengeCorrect + (isCorrect ? 1 : 0),
    solvedChallengeIds,
    activityDates: withActivityToday(progress),
    experiencePoints:
      progress.experiencePoints + (isCorrect && !alreadySolved ? 50 : 0),
  });
}

export function getCurrentStreak(activityDates, today = new Date()) {
  const dates = new Set(activityDates);
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (!dates.has(getTodayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;

  while (dates.has(getTodayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getCurrentWeekActivity(activityDates, today = new Date()) {
  const dates = new Set(activityDates);
  const firstDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  firstDay.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7));
  const labels = ["M", "T", "W", "T", "F", "S", "S"];

  return labels.map((label, index) => {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + index);
    return { label, active: dates.has(getTodayKey(date)) };
  });
}
