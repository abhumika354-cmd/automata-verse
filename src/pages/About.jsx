import "../styles/About.css";

function About() {
  return (
    <main className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-content">

          <span className="about-badge">
            ABOUT THE PROJECT
          </span>

          <h1>
            Automata 
            <br />
            Verse
          </h1>

          <p>
            An interactive learning platform that makes
            Formal Languages and Automata Theory easier to
            understand through gaming, pattern observation
            and simulation.
          </p>

        </div>

        <div className="about-hero-visual">

          <div className="arena-circle">
            <span className="arena-letter">A</span>
          </div>

          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>

        </div>
      </section>


      {/* PROJECT OVERVIEW */}
      <section className="about-overview">

        <div className="about-section-heading">
          <span>PROJECT OVERVIEW</span>

          <h2>Learning Automata in an Interactive Way</h2>

          <p>
            Automata Verse combines theoretical concepts
            from FLAT with interactive frontend experiences.
            Instead of only reading about states and transitions,
            students can see these concepts working inside the
            application.
          </p>
        </div>

        <div className="overview-grid">

          <div className="overview-card">
            <div className="overview-icon">🎮</div>

            <h3>Learn While Solving Questions</h3>

            <p>
              There are three methods Decode the DFA, Fix the DFA and Build the Answer.
            </p>
          </div>


          <div className="overview-card">
            <div className="overview-icon">01</div>

            <h3>Observe Patterns</h3>

            <p>
              Binary strings can be tested against automata
              rules to understand how states change while
              processing input.
            </p>
          </div>


          <div className="overview-card">
            <div className="overview-icon">⚙</div>

            <h3>Build & Simulate</h3>

            <p>
              Users can create DFA states and transitions,
              then test whether an input string is accepted
              or rejected.
            </p>
          </div>

        </div>
      </section>


      {/* FLAT CONNECTION */}
      <section className="flat-section">

        <div className="about-section-heading">
          <span>FLAT CONNECTION</span>

          <h2>Where Theory Meets Implementation</h2>

          <p>
            Each major part of the project demonstrates a
            concept studied in Formal Languages and Automata
            Theory.
          </p>
        </div>

        <div className="flat-grid">

          <div className="flat-card">
            <span className="flat-number">01</span>

            <h3>Challenge Engine</h3>

            <p>
              Three type of Challenges Decode, Fix and build your DFA.
            </p>

            <div className="flat-flow">
              DECODE → FIX → BUILD YOUR ANSWER
            </div>
          </div>


          <div className="flat-card">
            <span className="flat-number">02</span>

            <h3>DFA</h3>

            <p>
              DFA concepts are used to process binary strings
              and determine whether the given pattern is valid.
            </p>

            <div className="flat-flow">
              INPUT → STATE → DECISION
            </div>
          </div>


          <div className="flat-card">
            <span className="flat-number">03</span>

            <h3>DFA Simulator</h3>

            <p>
              You can build your own DFA Based on your Questions.
            </p>

            <div className="flat-flow">
              ADD NEW STATE → ADD TRANSITION → RUN
            </div>
          </div>

        </div>
      </section>


      {/* FEATURES */}
      <section className="features-section">

        <div className="about-section-heading">
          <span>KEY FEATURES</span>

          <h2>What the Platform Provides</h2>
        </div>

        <div className="features-list">

          <div className="feature-row">
            <div className="feature-number">01</div>

            <div>
              <h3>Interactive Challenges</h3>

              <p>
                Solve questions in three ways 
              </p>
            </div>
          </div>


          <div className="feature-row">
            <div className="feature-number">02</div>

            <div>
              <h3>Pattern Validation</h3>

              <p>
                Enter binary strings and observe how an
                automaton processes each input symbol.
              </p>
            </div>
          </div>


          <div className="feature-row">
            <div className="feature-number">03</div>

            <div>
              <h3>DFA Simulator</h3>

              <p>
                Create states, add transitions and test
                your own finite automaton.
              </p>
            </div>
          </div>


          <div className="feature-row">
            <div className="feature-number">04</div>

            <div>
              <h3>Automata Learning Section</h3>

              <p>
                Learn important FLAT concepts through simple
                explanations and project-based examples.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* PROJECT GOAL */}
      <section className="goal-section">

        <div className="goal-content">

          <span>PROJECT GOAL</span>

          <h2>
            Making Automata
            <br />
            Easier to Understand
          </h2>

          <p>
            The main goal of Automata Verse is to
            connect classroom theory with practical
            interaction. Students can learn a concept,
            experiment with it and immediately observe
            the result.
          </p>

        </div>

        <div className="goal-points">

          <div>
            <strong>Learn</strong>
            <span>Understand the concept</span>
          </div>

          <div>
            <strong>Experiment</strong>
            <span>Interact with the automata</span>
          </div>

          <div>
            <strong>Observe</strong>
            <span>See how the system behaves</span>
          </div>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="about-cta">

        <span>AUTOMATA VERSE</span>

        <h2>
          Learn the Theory.
          <br />
          Play With the Logic.
        </h2>

        <p>
          Explore the world of automata and master concepts through interaction. ⭐
        </p>

      </section>

    </main>
  );
}

export default About;