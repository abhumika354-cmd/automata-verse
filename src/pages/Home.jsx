
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <main className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            FLAT • AUTOMATA • INTERACTIVE LEARNING
          </span>

          <h1>
            Learn Automata
            <span>By Playing With It.</span>
          </h1>

          <p className="hero-description">
            Automata Verse is an interactive learning platform
            where you can understand FSM, DFA, patterns and automata
            concepts through simulation and interactive challenges.
          </p>

          <div className="hero-buttons">
            <Link to="/simulator" className="primary-button">
              Explore Simulator →
            </Link>

            <Link to="/learn" className="secondary-button">
              Learn Automata
            </Link>
          </div>

          <div className="hero-tech-line">
            <span>FSM</span>
            <span>•</span>
            <span>DFA</span>
            <span>•</span>
            <span>TRANSITIONS</span>
            <span>•</span>
            <span>REGULAR LANGUAGE</span>
          </div>
        </div>

        {/* DFA SIMULATOR VISUAL */}
        <div className="hero-visual">
          <div className="arena-preview simulator-preview">
            <div className="arena-top">
              <span>DFA SIMULATOR</span>
              <span className="live-indicator">
                ● READY
              </span>
            </div>

            <div className="arena-grid simulator-grid">
              <svg
                className="simulator-diagram"
                viewBox="0 0 600 360"
                role="img"
                aria-label="DFA simulator with start state q0, accepting state q1, and transitions labelled zero and one"
              >
                <defs>
                  <linearGradient
                    id="simulatorLineGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#feffff" />
                    <stop offset="100%" stopColor="#c1f3eb" />
                  </linearGradient>

                  <filter id="simulatorGlow">
                    <feGaussianBlur
                      stdDeviation="5"
                      result="blur"
                    />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <marker
                    id="simulatorArrow"
                    markerWidth="9"
                    markerHeight="9"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <path
                      d="M0,0 L0,6 L7,3 z"
                      fill="#bacaf9"
                    />
                  </marker>

                  <marker
                    id="simulatorTealArrow"
                    markerWidth="9"
                    markerHeight="9"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <path
                      d="M0,0 L0,6 L7,3 z"
                      fill="#d1faf3"
                    />
                  </marker>
                </defs>

                {/* Start arrow */}
                <path
                  d="M 35 180 L 105 180"
                  stroke="#b1faee"
                  strokeWidth="3"
                  fill="none"
                  markerEnd="url(#simulatorTealArrow)"
                />

                {/* Transition q0 to q1 */}
                <path
                  d="M 175 150 C 230 65, 365 65, 420 150"
                  stroke="url(#simulatorLineGradient)"
                  strokeWidth="3"
                  fill="none"
                  markerEnd="url(#simulatorArrow)"
                />

                <text
                  x="300"
                  y="85"
                  className="simulator-transition-label"
                  textAnchor="middle"
                >
                  1
                </text>

                {/* Transition q1 to q0 */}
                <path
                  d="M 420 210 C 365 295, 230 295, 175 210"
                  stroke="#c5d2f7"
                  strokeWidth="3"
                  strokeDasharray="7 7"
                  fill="none"
                  markerEnd="url(#simulatorArrow)"
                />

                <text
                  x="300"
                  y="285"
                  className="simulator-transition-label"
                  textAnchor="middle"
                >
                  0
                </text>

                {/* q0 loop */}
                <path
                  d="M 112 145 C 55 65, 175 35, 155 125"
                  stroke="#b7faef"
                  strokeWidth="2.5"
                  fill="none"
                  markerEnd="url(#simulatorTealArrow)"
                />

                <text
                  x="105"
                  y="65"
                  className="simulator-small-label"
                  textAnchor="middle"
                >
                  0
                </text>

                {/* State q0 */}
                <g filter="url(#simulatorGlow)">
                  <circle
                    cx="145"
                    cy="180"
                    r="49"
                    fill="#358dad"
                    stroke="#bffef4"
                    strokeWidth="3"
                  />

                  <circle
                    cx="145"
                    cy="180"
                    r="40"
                    fill="none"
                    stroke="#02fcd2"
                    strokeOpacity="0.7"
                    strokeWidth="2"
                  />
                </g>

                {/* State q1 */}
                <g filter="url(#simulatorGlow)">
                  <circle
                    cx="455"
                    cy="180"
                    r="49"
                    fill="#358dad"
                    stroke="#bffef4"
                    strokeWidth="3"
                  />

                  <circle
                    cx="455"
                    cy="180"
                    r="39"
                    fill="none"
                    stroke="#02fcd2"
                    strokeWidth="2"
                    strokeOpacity="0.7"
                  />
                </g>

                <text
                  x="145"
                  y="188"
                  className="simulator-state-label"
                  textAnchor="middle"
                >
                  q0
                </text>

                <text
                  x="455"
                  y="188"
                  className="simulator-state-label"
                  textAnchor="middle"
                >
                  q1
                </text>

                <text
                  x="145"
                  y="248"
                  className="simulator-caption"
                  textAnchor="middle"
                  fill="#ffffff"
                >
                  START STATE
                </text>

                <text
                  x="455"
                  y="248"
                  className="simulator-caption"
                  textAnchor="middle"
                  fill="#ffffff"
                >
                  FINAL STATE
                </text>
              </svg>

              <div className="simulator-input-chip">
                <span>INPUT</span>
                <strong>1 0 1 1</strong>
              </div>
            </div>

            <div className="arena-footer">
              <span>STATE TRANSITIONS</span>
              <span>DFA • Σ = {"{0, 1}"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* THREE WAYS TO LEARN */}
      <section className="learning-section">
        <div className="section-heading">
          <p className="section-label">
            ONE PLATFORM • THREE WAYS TO LEARN
          </p>

          <h2>
            Understand Automata
            <br />
            Through Interaction
          </h2>

          <p>
            Choose how you want to learn. Solve automata questions,
            observe patterns or simulate automata step by step.
          </p>
        </div>

        <div className="learning-cards">
          {/* CARD 1 — CHALLENGES */}
          <Link to="/challenge" className="learning-card">
            <div className="card-top">
              <span className="card-number">01</span>

              <div className="card-icon gaming-icon">
                🧠
              </div>
            </div>

            <p className="card-label">
              AUTOMATA CHALLENGE
            </p>

            <h3>
              Learn While Solving Questions
            </h3>

            <p>
              Test your automata knowledge through interactive
              challenges. Decode a DFA, fix incorrect transitions,
              and build the correct answer.
            </p>

            <div className="card-tags">
              <span>DECODE</span>
              <span>FIX DFA</span>
              <span>BUILD</span>
            </div>

            <span className="card-link">
              Start Challenge →
            </span>
          </Link>

          {/* CARD 2 — PATTERNS */}
          <Link to="/patterns" className="learning-card">
            <div className="card-top">
              <span className="card-number">02</span>

              <div className="card-icon pattern-icon">
                ◉
              </div>
            </div>

            <p className="card-label">
              PATTERN OBSERVATION
            </p>

            <h3>
              Learn While Observing Patterns
            </h3>

            <p>
              Enter binary strings and observe how a DFA
              processes each symbol and decides whether
              the pattern is accepted.
            </p>

            <div className="card-tags">
              <span>DFA</span>
              <span>LANGUAGE</span>
              <span>PATTERNS</span>
            </div>

            <span className="card-link">
              Test Patterns →
            </span>
          </Link>

          {/* CARD 3 — SIMULATOR */}
          <Link to="/simulator" className="learning-card">
            <div className="card-top">
              <span className="card-number">03</span>

              <div className="card-icon simulator-icon">
                ⟳
              </div>
            </div>

            <p className="card-label">
              AUTOMATA SIMULATOR
            </p>

            <h3>
              Learn by Simulator
            </h3>

            <p>
              Run an automaton step by step and visually
              understand how states and transitions process
              an input string.
            </p>

            <div className="card-tags">
              <span>STATES</span>
              <span>TRANSITIONS</span>
              <span>DFA</span>
            </div>

            <span className="card-link">
              Open Simulator →
            </span>
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="process-section">
        <div className="section-heading">
          <p className="section-label">
            HOW IT WORKS
          </p>

          <h2>
            From Input to Decision
          </h2>

          <p>
            The platform converts automata concepts into
            simple interactive experiences.
          </p>
        </div>

        <div className="process-flow">
          <div className="process-step">
            <span className="process-number">01</span>

            <div className="process-icon">
              ↓
            </div>

            <h3>Input</h3>

            <p>
              User provides a pattern or starts an
              interactive simulation.
            </p>
          </div>

          <div className="process-arrow">→</div>

          <div className="process-step">
            <span className="process-number">02</span>

            <div className="process-icon">
              ◎
            </div>

            <h3>Automata</h3>

            <p>
              States and transition rules process
              the given situation.
            </p>
          </div>

          <div className="process-arrow">→</div>

          <div className="process-step">
            <span className="process-number">03</span>

            <div className="process-icon">
              ✓
            </div>

            <h3>Decision</h3>

            <p>
              The final state or transition result
              determines whether the input is accepted.
            </p>
          </div>
        </div>
      </section>

      {/* FLAT CONCEPTS */}
      <section className="concept-section">
        <div className="concept-content">
          <p className="section-label">
            FLAT CONCEPTS
          </p>

          <h2>
            Theory That You Can
            <br />
            Actually See.
          </h2>

          <p className="concept-description">
            Instead of only reading automata theory,
            this platform shows how these concepts work
            through interactive visual experiences.
          </p>

          <div className="concept-points">
            <div className="concept-box">
              <span className="concept-number">01</span>

              <strong>CHALLENGES</strong>

              <span>
                Decode, Fix and Build your Answer.
              </span>
            </div>

            <div className="concept-box">
              <span className="concept-number">02</span>

              <strong>DFA</strong>

              <span>
                Validates input patterns
              </span>
            </div>

            <div className="concept-box">
              <span className="concept-number">03</span>

              <strong>DFA SIMULATOR</strong>

              <span>
                Explore states and transitions.
              </span>
            </div>

            <div className="concept-box">
              <span className="concept-number">04</span>

              <strong>REGULAR LANGUAGE</strong>

              <span>
                Defines accepted patterns
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="cta-glow"></div>

        <p className="section-label">
          READY TO EXPLORE?
        </p>

        <h2>
          Enter the World
          <br />
          of Automata.
        </h2>

        <p>
          Learn FSM, DFA, patterns and automata
          concepts through interaction.
        </p>

        <Link to="/simulator" className="cta-button">
          Explore Simulator →
        </Link>
      </section>
    </main>
  );
}

export default Home;