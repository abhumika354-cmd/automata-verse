import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  getCurrentStreak,
  LEARNING_LESSONS,
  readLearningProgress,
} from "../learningProgress";
import Icon from "../components/Icon";
import Sidebar from "../components/Sidebar";
import WorkspaceTopbar from "../components/WorkspaceTopbar";
import "../styles/Home.css";

function LearningDiagram() {
  return (
    <svg
      className="home-dfa-diagram"
      viewBox="0 0 460 180"
      role="img"
      aria-label="Automaton with states q0, q1, and accepting state q2"
    >
      <defs>
        <marker
          id="home-dfa-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0 0 8 4 0 8" fill="none" stroke="#171717" strokeWidth="1.4" />
        </marker>
      </defs>
      <path d="M8 87h44" className="home-dfa-line" markerEnd="url(#home-dfa-arrow)" />
      <path d="M101 87h93" className="home-dfa-line" markerEnd="url(#home-dfa-arrow)" />
      <text x="147" y="77" className="home-dfa-label">0</text>
      <path d="M247 87h82" className="home-dfa-line" markerEnd="url(#home-dfa-arrow)" />
      <text x="288" y="77" className="home-dfa-label">1</text>
      <path d="M59 61C25 12 112 4 80 61" className="home-dfa-line" markerEnd="url(#home-dfa-arrow)" />
      <text x="55" y="24" className="home-dfa-label">1</text>
      <path d="M207 61c-34-49 53-57 21 0" className="home-dfa-line" markerEnd="url(#home-dfa-arrow)" />
      <text x="203" y="24" className="home-dfa-label">0</text>
      <path d="M357 114c-17 42-83 42-104 0" className="home-dfa-line" markerEnd="url(#home-dfa-arrow)" />
      <text x="305" y="153" className="home-dfa-label">0</text>
      <path d="M351 119c-53 65-230 65-284 0" className="home-dfa-line" markerEnd="url(#home-dfa-arrow)" />
      <text x="203" y="172" className="home-dfa-label">1</text>
      <circle cx="76" cy="87" r="25" className="home-dfa-state" />
      <text x="76" y="92" className="home-dfa-state-label">q0</text>
      <circle cx="222" cy="87" r="25" className="home-dfa-state" />
      <text x="222" y="92" className="home-dfa-state-label">q1</text>
      <circle cx="354" cy="87" r="25" className="home-dfa-state" />
      <circle cx="354" cy="87" r="20" className="home-dfa-final-ring" />
      <text x="354" y="92" className="home-dfa-state-label">q2</text>
    </svg>
  );
}

function Home() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(readLearningProgress);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const profileName = localStorage.getItem("userName") || "Alex Morgan";
  const firstName = profileName.trim().split(/\s+/)[0] || "Alex";
  const streak = getCurrentStreak(progress.activityDates);
  const courseLessonIds = new Set(LEARNING_LESSONS.map((lesson) => lesson.id));
  const completedLessons = progress.completedLessonIds.filter((id) =>
    courseLessonIds.has(id)
  ).length;
  const courseLessonCount = LEARNING_LESSONS.length;
  const currentLesson = LEARNING_LESSONS[Math.min(completedLessons, courseLessonCount - 1)];
  const currentCourseLesson = Math.min(
    completedLessons + 1,
    courseLessonCount
  );
  const solvedChallenges = progress.solvedChallengeIds.length;
  const accuracy = progress.challengeAttempts
    ? Math.round((progress.challengeCorrect / progress.challengeAttempts) * 100)
    : 0;
  const learningMinutes = Math.floor(progress.learningSeconds / 60);
  const learningTime = learningMinutes >= 60
    ? (learningMinutes / 60).toFixed(1)
    : String(learningMinutes);
  const learningTimeUnit = learningMinutes >= 60 ? "hours" : "minutes";

  useEffect(() => {
    const refreshProgress = () => setProgress(readLearningProgress());
    window.addEventListener("learning-progress-updated", refreshProgress);
    window.addEventListener("storage", refreshProgress);

    return () => {
      window.removeEventListener("learning-progress-updated", refreshProgress);
      window.removeEventListener("storage", refreshProgress);
    };
  }, []);

  const handleProtectedClick = (event, path) => {
    if (!isLoggedIn) {
      event.preventDefault();
      navigate("/login", {
        state: { from: { pathname: path } },
      });
    }
  };

  return (
    <div className="home-dashboard">
      <Sidebar />

      <main className="home-main">
        <WorkspaceTopbar />

        <div className="home-content">
          <section className="welcome-row">
            <div>
              <p className="home-eyebrow">YOUR LEARNING SPACE</p>
              <h1>Welcome back, {firstName}</h1>
              <p>Small steps. Clearer concepts. Stronger foundations.</p>
            </div>
            <span className="welcome-streak">{streak}-day streak</span>
          </section>

          <section className="continue-card">
            <div className="continue-copy">
              <span className="continue-label">PICK UP WHERE YOU LEFT OFF</span>
              <h2>Turn abstract theory<br />into something you can see.</h2>
              <p>
                {completedLessons >= courseLessonCount
                  ? "Course complete · Automata project"
                  : `Lesson ${currentLesson.id.split("-")[1]} · ${currentLesson.title}`}
              </p>
              <div className="continue-actions">
                <NavLink
                  to="/learn"
                  onClick={(event) => handleProtectedClick(event, "/learn")}
                  className="home-action-button"
                >
                  Continue learning <Icon name="arrow" size={14} />
                </NavLink>
                <span>
                  {completedLessons >= courseLessonCount
                    ? `All ${courseLessonCount} lessons completed`
                    : `Lesson ${currentCourseLesson} of ${courseLessonCount}`}
                </span>
              </div>
            </div>
            <div className="continue-visual">
              <LearningDiagram />
              <span>READ · TRACE · UNDERSTAND</span>
            </div>
          </section>

          <section className="learning-stats" aria-label="Learning statistics">
            <article className="stat-card">
              <p>Lessons completed</p>
              <div className="stat-value">
                {String(completedLessons).padStart(2, "0")}
                <small>of {courseLessonCount} lessons</small>
              </div>
              <div className="stat-progress">
                <span style={{ width: `${Math.min(100, (completedLessons / courseLessonCount) * 100)}%` }} />
              </div>
              <small className={`stat-caption${completedLessons ? " positive" : ""}`}>
                {completedLessons
                  ? `${Math.round((completedLessons / courseLessonCount) * 100)}% of your learning path`
                  : "Complete a lesson to get started"}
              </small>
            </article>
            <article className="stat-card">
              <p>Challenges solved</p>
              <div className="stat-value">
                {String(solvedChallenges).padStart(2, "0")}
                <small>of 18 challenges</small>
              </div>
              <div className="stat-progress">
                <span style={{ width: `${Math.min(100, (solvedChallenges / 18) * 100)}%` }} />
              </div>
              <small className={`stat-caption${solvedChallenges ? " positive" : ""}`}>
                {solvedChallenges
                  ? `${solvedChallenges} challenge${solvedChallenges === 1 ? "" : "s"} solved`
                  : "No challenges solved yet"}
              </small>
            </article>
            <article className="stat-card">
              <p>Learning time</p>
              <div className="stat-value">
                {learningTime}
                <small>{learningTimeUnit}</small>
              </div>
              <div className="stat-progress">
                <span style={{ width: `${Math.min(100, (learningMinutes / 60) * 100)}%` }} />
              </div>
              <small className="stat-caption">
                {learningMinutes ? "Active learning time" : "Time adds up as you learn"}
              </small>
            </article>
            <article className="stat-card">
              <p>Overall accuracy</p>
              <div className="stat-value">{accuracy}<small>%</small></div>
              <div className="stat-progress">
                <span style={{ width: `${accuracy}%` }} />
              </div>
              <small className={`stat-caption${progress.challengeAttempts ? " positive" : ""}`}>
                {progress.challengeAttempts
                  ? `${progress.challengeCorrect} correct of ${progress.challengeAttempts} attempts`
                  : "No attempts yet"}
              </small>
            </article>
          </section>

          <section className="home-next-section">
            <div className="next-column">
              <div className="section-title-row">
                <h2>Your next steps</h2>
                <NavLink
                  to="/learn"
                  onClick={(event) => handleProtectedClick(event, "/learn")}
                >
                  View learning path <Icon name="arrow" size={13} />
                </NavLink>
              </div>

              <div className="next-steps-card">
                <NavLink
                  to="/learn"
                  onClick={(event) => handleProtectedClick(event, "/learn")}
                  className="next-step"
                >
                  <span className="next-step-number purple">03</span>
                  <span className="next-step-copy">
                    <strong>Reading a DFA</strong>
                    <small>Follow states, transitions, and input strings.</small>
                  </span>
                  <span className="next-step-meta">12 min<small>Resume →</small></span>
                </NavLink>
                <NavLink
                  to="/learn"
                  onClick={(event) => handleProtectedClick(event, "/learn")}
                  className="next-step"
                >
                  <span className="next-step-number blue">04</span>
                  <span className="next-step-copy">
                    <strong>Accepted or rejected?</strong>
                    <small>See how a final state determines the result.</small>
                  </span>
                  <span className="next-step-meta">10 min<small>Read →</small></span>
                </NavLink>
                <NavLink
                  to="/learn"
                  onClick={(event) => handleProtectedClick(event, "/learn")}
                  className="next-step"
                >
                  <span className="next-step-number navy">05</span>
                  <span className="next-step-copy">
                    <strong>From DFA to a language</strong>
                    <small>Find the pattern behind the machine.</small>
                  </span>
                  <span className="next-step-meta">15 min<small>Read →</small></span>
                </NavLink>
              </div>
            </div>

            <article className="daily-challenge">
              <span className="daily-label">DAILY CHALLENGE</span>
              <h2>Can you decode it?</h2>
              <p>One machine. A hidden pattern.<br />Find the language it accepts.</p>
              <div className="challenge-meta">
                BEGINNER <span>·</span> 5 MIN <span>·</span> +50 XP
              </div>
              <NavLink
                to="/challenge"
                onClick={(event) => handleProtectedClick(event, "/challenge")}
                className="challenge-button"
              >
                Take the challenge <Icon name="arrow" size={14} />
              </NavLink>
            </article>
          </section>

          <footer className="home-footer">
            Your progress is saved automatically. Keep exploring at your own pace.
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Home;
