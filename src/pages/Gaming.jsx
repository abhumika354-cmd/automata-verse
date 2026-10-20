import { Link } from "react-router-dom";
import "../styles/Gaming.css";

function Gaming() {
  return (
    <main className="gaming-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="gaming-header">

        <div className="gaming-header-content">

          <p className="gaming-label">
            LEARN WHILE GAMING
          </p>

          <h1>
            Enter the
            <span>Battle Arena.</span>
          </h1>

          <p className="gaming-intro">
            Choose your bot and understand how a Finite
            State Machine controls its behaviour during battle.
          </p>

          <div className="gaming-header-tags">
            <span>FSM</span>
            <span>STATE TRANSITIONS</span>
            <span>INTERACTIVE</span>
          </div>

        </div>

        <div className="gaming-hero-visual">

          <div className="mini-arena">

            <div className="mini-arena-top">
              <span>FSM COMBAT</span>
              <span>● LIVE</span>
            </div>

            <div className="mini-arena-body">

              <div className="mini-state mini-state-1">
                SEARCH
              </div>

              <div className="mini-state mini-state-2">
                MOVE
              </div>

              <div className="mini-state mini-state-3">
                ATTACK
              </div>

              <div className="mini-bot mini-alpha">
                A
              </div>

              <div className="mini-vs">
                VS
              </div>

              <div className="mini-bot mini-beta">
                B
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          BOT SELECTION
      ========================= */}

      <section className="bot-selection">

        <div className="section-heading gaming-section-heading">

          <p className="gaming-label">
            BOT CONFIGURATION
          </p>

          <h2>
            Choose Your Bots
          </h2>

          <p>
            Each bot has different properties, but both
            follow FSM-based behaviour during the battle.
          </p>

        </div>


        <div className="bot-grid">

          {/* =========================
              ALPHA BOT
          ========================= */}

          <div className="bot-card">

            <div className="bot-card-top">

              <div className="bot-avatar alpha-avatar">
                🤖
              </div>

              <span className="bot-number">
                BOT 01
              </span>

            </div>

            <div className="bot-info">

              <h3>
                Alpha Bot
              </h3>

              <p className="bot-type">
                Balanced FSM Bot
              </p>

              <div className="bot-stats">

                <div className="stat">
                  <strong>100</strong>
                  <span>Health</span>
                </div>

                <div className="stat">
                  <strong>20</strong>
                  <span>Attack</span>
                </div>

                <div className="stat">
                  <strong>20</strong>
                  <span>Defense</span>
                </div>

              </div>

            </div>

            <div className="bot-status">
              <span></span>
              FSM CONTROLLED
            </div>

          </div>


          {/* =========================
              BETA BOT
          ========================= */}

          <div className="bot-card">

            <div className="bot-card-top">

              <div className="bot-avatar beta-avatar">
                👾
              </div>

              <span className="bot-number">
                BOT 02
              </span>

            </div>

            <div className="bot-info">

              <h3>
                Beta Bot
              </h3>

              <p className="bot-type">
                Defensive FSM Bot
              </p>

              <div className="bot-stats">

                <div className="stat">
                  <strong>100</strong>
                  <span>Health</span>
                </div>

                <div className="stat">
                  <strong>20</strong>
                  <span>Attack</span>
                </div>

                <div className="stat">
                  <strong>20</strong>
                  <span>Defense</span>
                </div>

              </div>

            </div>

            <div className="bot-status">
              <span></span>
              FSM CONTROLLED
            </div>

          </div>

        </div>


        {/* =========================
            VS
        ========================= */}

        <div className="vs-section">

          <div className="vs-line"></div>

          <div className="vs">
            VS
          </div>

          <div className="vs-line"></div>

        </div>


        {/* =========================
            START BATTLE
        ========================= */}

        <div className="start-battle-container">

          <Link to="/battle" className="start-battle-button">
            ⚔ Start Battle
          </Link>

        </div>

      </section>


      {/* =========================
          FSM EXPLANATION
      ========================= */}

      <section className="fsm-info">

        <div className="fsm-info-content">

          <div className="fsm-info-heading">

            <p className="gaming-label">
              THE CORE CONCEPT
            </p>

            <h2>
              How the Bots
              <span>Think.</span>
            </h2>

            <p>
              Every bot follows a Finite State Machine.
              Its current state determines what action it
              performs and transition rules determine
              which state comes next.
            </p>

          </div>


          <div className="fsm-states">

            <div className="fsm-state">

              <span className="fsm-state-number">
                01
              </span>

              <strong>
                SEARCH
              </strong>

              <span>
                Find opponent
              </span>

            </div>


            <div className="fsm-arrow">
              →
            </div>


            <div className="fsm-state">

              <span className="fsm-state-number">
                02
              </span>

              <strong>
                MOVE
              </strong>

              <span>
                Move towards opponent
              </span>

            </div>


            <div className="fsm-arrow">
              →
            </div>


            <div className="fsm-state">

              <span className="fsm-state-number">
                03
              </span>

              <strong>
                ATTACK
              </strong>

              <span>
                Attack opponent
              </span>

            </div>


            <div className="fsm-arrow">
              →
            </div>


            <div className="fsm-state defend-state">

              <span className="fsm-state-number">
                04
              </span>

              <strong>
                DEFEND
              </strong>

              <span>
                Protect from attack
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          BATTLE LOGIC
      ========================= */}

      <section className="battle-logic">

        <div className="section-heading">

          <p className="gaming-label">
            SITUATION BASED BEHAVIOUR
          </p>

          <h2>
            The Bot Does Not
            <br />
            Follow a Fixed Sequence
          </h2>

          <p>
            The next state depends on what is happening
            inside the arena.
          </p>

        </div>


        <div className="logic-grid">

          <div className="logic-card">

            <span className="logic-icon">
              ?
            </span>

            <h3>
              Enemy Far Away
            </h3>

            <p>
              The bot searches for the opponent and
              calculates where it needs to go.
            </p>

            <strong>
              SEARCH
            </strong>

          </div>


          <div className="logic-card">

            <span className="logic-icon">
              →
            </span>

            <h3>
              Enemy Found
            </h3>

            <p>
              If the opponent is nearby but not in
              attack range, the bot moves towards it.
            </p>

            <strong>
              MOVE
            </strong>

          </div>


          <div className="logic-card">

            <span className="logic-icon">
              ⚔
            </span>

            <h3>
              Enemy in Range
            </h3>

            <p>
              When the opponent is close enough,
              the bot can perform an attack.
            </p>

            <strong>
              ATTACK
            </strong>

          </div>


          <div className="logic-card">

            <span className="logic-icon">
              🛡
            </span>

            <h3>
              Health is Low
            </h3>

            <p>
              When health becomes low, the bot changes
              behaviour and protects itself.
            </p>

            <strong>
              DEFEND
            </strong>

          </div>

        </div>

      </section>


      {/* =========================
          BATTLE CTA
      ========================= */}

      <section className="gaming-cta">

        <p className="gaming-label">
          READY?
        </p>

        <h2>
          Watch the FSM
          <br />
          Come Alive.
        </h2>

        <p>
          Start the battle and observe how the bots
          change their states according to the situation.
        </p>

        <Link to="/battle" className="cta-battle-button">
          Enter Battle Arena →
        </Link>

      </section>

    </main>
  );
}

export default Gaming;