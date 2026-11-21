import { useEffect, useState } from "react";
import {
  completeLesson,
  LEARNING_LESSONS,
  markLessonUnread,
  readLearningProgress,
} from "../learningProgress";
import "../styles/Learn.css";

function Learn() {
  const [progress, setProgress] = useState(readLearningProgress);
  const completedLessonIds = new Set(progress.completedLessonIds);
  const currentLessonIndex = LEARNING_LESSONS.findIndex(
    (lesson) => !completedLessonIds.has(lesson.id)
  );
  const allLessonsCompleted = currentLessonIndex === -1;
  const currentLesson = allLessonsCompleted
    ? LEARNING_LESSONS[LEARNING_LESSONS.length - 1]
    : LEARNING_LESSONS[currentLessonIndex];
  const [selectedLessonId, setSelectedLessonId] = useState(
    () => (
      allLessonsCompleted
        ? LEARNING_LESSONS[LEARNING_LESSONS.length - 1].id
        : currentLesson.id
    )
  );
  const selectedLessonIndex = LEARNING_LESSONS.findIndex(
    (lesson) => lesson.id === selectedLessonId
  );
  const selectedLesson = selectedLessonIndex >= 0
    ? LEARNING_LESSONS[selectedLessonIndex]
    : currentLesson;
  const isSelectedCompleted = completedLessonIds.has(selectedLesson.id);
  const isSelectedCurrent = !allLessonsCompleted && selectedLesson.id === currentLesson.id;
  const completedLessons = LEARNING_LESSONS.filter((lesson) =>
    completedLessonIds.has(lesson.id)
  ).length;

  useEffect(() => {
    const refreshProgress = () => setProgress(readLearningProgress());
    window.addEventListener("learning-progress-updated", refreshProgress);
    window.addEventListener("storage", refreshProgress);

    return () => {
      window.removeEventListener("learning-progress-updated", refreshProgress);
      window.removeEventListener("storage", refreshProgress);
    };
  }, []);

  const handleCompleteLesson = () => {
    if (isSelectedCurrent) {
      completeLesson(selectedLesson.id);
      const nextLesson = LEARNING_LESSONS[selectedLessonIndex + 1];
      if (nextLesson) {
        setSelectedLessonId(nextLesson.id);
      }
      setProgress(readLearningProgress());
    }
  };

  const handleMarkUnread = () => {
    markLessonUnread(selectedLesson.id);
    setSelectedLessonId(selectedLesson.id);
    setProgress(readLearningProgress());
  };

  return (
    <main className="learn-page">
      {/* HERO SECTION */}
      <section className="learn-hero">
        <div className="learn-hero-content">
          <span className="learn-badge">
            {LEARNING_LESSONS.length} LESSON COURSE • AUTOMATAVERSE
          </span>

          <h1>{selectedLesson.title}</h1>

          <p>{selectedLesson.topic}</p>
        </div>

        <div className="learn-hero-visual">
          <div className="mini-state start">q0</div>
          <div className="mini-arrow">→</div>
          <div className="mini-state final">q1</div>
        </div>
      </section>

      <section className="lesson-course" aria-label="AutomataVerse lesson course">
        <div className="lesson-course-heading">
          <div>
            <span className="section-label">YOUR PROJECT COURSE</span>
            <h2>{LEARNING_LESSONS.length} lessons, one concept at a time</h2>
          </div>
          <strong>{completedLessons} / {LEARNING_LESSONS.length} completed</strong>
        </div>

        <div className="lesson-list">
          {LEARNING_LESSONS.map((lesson, index) => {
            const isCompleted = completedLessonIds.has(lesson.id);
            const isCurrent = !allLessonsCompleted && lesson.id === currentLesson.id;

            return (
              <button
                type="button"
                className={`lesson-list-item${isCompleted ? " completed" : ""}${isCurrent ? " current" : ""}${selectedLesson.id === lesson.id ? " selected" : ""}`}
                key={lesson.id}
                onClick={() => setSelectedLessonId(lesson.id)}
                aria-pressed={selectedLesson.id === lesson.id}
              >
                <span className="lesson-list-number">
                  {isCompleted ? "✓" : String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.topic}</p>
                </div>
                <span className="lesson-status">
                  {isCompleted ? "Completed" : isCurrent ? "In progress" : "Locked"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="active-lesson" aria-label={`${selectedLesson.title} lesson content`}>
        <div className="active-lesson-heading">
          <span>Lesson {String(selectedLessonIndex + 1).padStart(2, "0")}</span>
          <h2>{selectedLesson.title}</h2>
        </div>
        <p className="active-lesson-summary">{selectedLesson.summary}</p>
        <div className="lesson-key-points">
          {selectedLesson.points.map((point, index) => (
            <article key={point}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{point}</p>
            </article>
          ))}
        </div>
        <div className="lesson-explanation-grid">
          <article>
            <span>DEEPER EXPLANATION</span>
            <p>{selectedLesson.details}</p>
          </article>
          <article>
            <span>WORKED EXAMPLE</span>
            <p>{selectedLesson.example}</p>
          </article>
        </div>
        <div className="lesson-practice">
          <span>PRACTICE THIS LESSON</span>
          <p>{selectedLesson.practice}</p>
        </div>
        <div className="lesson-action-row">
          {isSelectedCompleted ? (
            <button
              type="button"
              className="lesson-unread-button"
              onClick={handleMarkUnread}
            >
              Mark as unread
            </button>
          ) : isSelectedCurrent ? (
            <button
              type="button"
              className="learn-complete-button"
              onClick={handleCompleteLesson}
            >
              Mark lesson complete · +50 XP
            </button>
          ) : (
            <button type="button" className="learn-complete-button" disabled>
              Complete previous lessons first
            </button>
          )}
        </div>
      </section>

      {/* INTRO */}
      <section className="learn-intro">
        <span className="section-label">CORE CONCEPTS</span>

        <h2>Understand Automata Step by Step</h2>

        <p>
          Automata theory is about machines that read input and make
          decisions according to predefined rules.
        </p>
      </section>

      {/* CONCEPT CARDS */}
      <section className="concept-grid">

        {/* FSM */}
        <article className="concept-card">
          <div className="concept-number">01</div>

          <div className="concept-icon">⚙</div>

          <h3>Learn By Solving Questions</h3>

          <p>
            There are mainly three types- Decode the DFA, Fix the DFA and Build the Answer 
          </p>

          <div className="concept-example">
            <strong>Example:</strong>
            <span>Which language is accepted by this DFA?</span>
          </div>
        </article>

        {/* DFA */}
        <article className="concept-card">
          <div className="concept-number">02</div>

          <div className="concept-icon">◎</div>

          <h3>Deterministic Finite Automaton</h3>

          <p>
            DFA is a finite automaton where each state has exactly
            one transition for every input symbol.
          </p>

          <div className="concept-example">
            <strong>Example:</strong>
            <span>q0 --1--&gt; q1</span>
          </div>
        </article>

        {/* REGULAR LANGUAGE */}
        <article className="concept-card">
          <div className="concept-number">03</div>

          <div className="concept-icon">01</div>

          <h3>Regular Language</h3>

          <p>
            A regular language is a set of strings that can be
            recognized by a finite automaton such as a DFA.
          </p>

          <div className="concept-example">
            <strong>Example:</strong>
            <span>Strings ending with 1</span>
          </div>
        </article>

        {/* BFS */}
        <article className="concept-card">
          <div className="concept-number">04</div>

          <div className="concept-icon">↗</div>

          <h3>Breadth First Search</h3>

          <p>
            BFS explores a grid or graph level by level. It can be
            used to find the shortest path between two positions.
          </p>

          <div className="concept-example">
            <strong>Example:</strong>
            <span>Finding a safe path around obstacles</span>
          </div>
        </article>

      </section>

      {/* FSM VS DFA */}
      <section className="comparison-section">

        <div className="section-heading">
          <span className="section-label">QUICK COMPARISON</span>

          <h2>FSM vs DFA</h2>
        </div>

        <div className="comparison-table">

          <div className="comparison-row comparison-header">
            <div>FSM</div>
            <div>DFA</div>
          </div>

          <div className="comparison-row">
            <div>
              Used to model state-based behavior.
            </div>

            <div>
              Used to recognize patterns or languages.
            </div>
          </div>

          <div className="comparison-row">
            <div>
              Can represent general state transitions.
            </div>

            <div>
              Has exactly one transition for each input symbol.
            </div>
          </div>

          <div className="comparison-row">
            <div>
              Useful for controlling system behavior.
            </div>

            <div>
              Useful for accepting or rejecting strings.
            </div>
          </div>

        </div>
      </section>

      {/* PROJECT CONNECTION */}
      <section className="project-section">

        <div className="section-heading">
          <span className="section-label">YOUR PROJECT</span>

          <h2>How Automata Concepts Are Used</h2>

          <p>
            Automata Verse connects the theory you study in
            FLAT with an interactive application.
          </p>
        </div>

        <div className="project-flow">

          <div className="project-item">
            <div className="project-icon">⚙</div>

            <h3>Challenge Engine</h3>

            <p>
              Challenges, answer validation aur scoring manage karta hai.
            </p>

            <span>Play Multiple Challenges</span>
          </div>

          <div className="project-connector">→</div>

          <div className="project-item">
            <div className="project-icon">◎</div>

            <h3>DFA</h3>

            <p>
              Validates binary patterns and determines whether an
              input string is accepted.
            </p>

            <span>Pattern Validation</span>
          </div>

          <div className="project-connector">→</div>

          <div className="project-item">
            <div className="project-icon">↗</div>

            <h3>DFA Simulator</h3>

            <p>
              Input string process karke acceptance/rejection dikhata hai.
            </p>

            <span>Build Your Own DFA</span>
          </div>

        </div>
      </section>

      {/* REVISION */}
      <section className="revision-section">

        <div className="revision-content">

          <span className="section-label">QUICK REVISION</span>

          <h2>Remember These Four Points</h2>

          <div className="revision-list">

            <div className="revision-item">
              <span>01</span>

              <p>
                <strong>Challenges</strong> → Play With Challenges and solve questions.
              </p>
            </div>

            <div className="revision-item">
              <span>02</span>

              <p>
                <strong>DFA</strong> → Processes input and accepts or
                rejects strings.
              </p>
            </div>

            <div className="revision-item">
              <span>03</span>

              <p>
                <strong>Regular Language</strong> → A language that
                can be recognized by a finite automaton.
              </p>
            </div>

            <div className="revision-item">
              <span>04</span>

              <p>
                <strong>DFA Simulator</strong> → Finds the shortest path in a
                Build DFA on a grid.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="learn-cta">

        <span>READY TO PRACTICE?</span>

        <h2>
          Learn the Theory.
          <br />
          See It in Action.
        </h2>

        <p>
          Explore patterns, build automata and practice
          automata concepts through interactive challenges.
        </p>

        <button
          type="button"
          className="learn-complete-button"
          onClick={handleCompleteLesson}
          disabled={!isSelectedCurrent}
        >
          {isSelectedCompleted
            ? "Lesson completed ✓"
            : isSelectedCurrent
              ? "Mark lesson complete · +50 XP"
              : "Complete previous lessons first"}
        </button>
      </section>

    </main>
  );
}

export default Learn;
