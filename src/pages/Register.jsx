import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://automata-verse-api-2026.onrender.com";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!termsAccepted) {
      setMessage("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    if (!/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setMessage("Password must include a number and a symbol.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(
          data.error ||
            data.message ||
            `Registration failed (${response.status}).`
        );
        return;
      }

      setMessage(
        data.message ||
          "Registration successful! Redirecting to login..."
      );

      setName("");
      setEmail("");
      setPassword("");
      setTermsAccepted(false);

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(
        "Cannot connect to the server. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="register-page">

      {/* LEFT SIDE - REGISTER FORM */}
      <section className="register-left">

        <div className="register-brand">
          <div className="register-brand-icon">▷</div>

          <div>
            <div className="register-brand-name">AutomataVerse</div>
            <div className="register-brand-tagline">
              INTERACTIVE AUTOMATA LEARNING
            </div>
          </div>
        </div>

        <div className="register-content">

          <div className="register-heading">
            <h1>Start your new chapter.</h1>
            <p>Your first state is just the beginning.</p>
          </div>

          <form className="register-form" onSubmit={handleRegister}>

            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Password</label>

              <div className="password-wrapper">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword((previous) => !previous)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <small className="password-hint">
                Use at least 8 characters with a number and a symbol.
              </small>
            </div>

            <div className="register-agreement">
              <input
                id="terms-accepted"
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
                required
              />
              <label htmlFor="terms-accepted">
                I agree to the <strong>Terms of Service</strong> and{" "}
                <strong>Privacy Policy</strong>.
              </label>
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create free account  →"}
            </button>

            {message && (
              <p className="register-message" role="status">
                {message}
              </p>
            )}

          </form>

          <p className="register-note">
            Free to start. Learn at your own pace.
          </p>

        </div>

        <div className="register-footer">
          <span>Already learning with us?</span>

          <button
            type="button"
            className="login-link"
            onClick={() => navigate("/login")}
          >
            Sign in →
          </button>
        </div>

      </section>

      {/* RIGHT SIDE - AUTOMATA DESIGN */}
      <section className="register-right">

        <div className="right-content">

          <div className="right-eyebrow">
            UNDERSTAND. EXPERIMENT. CREATE.
          </div>

          <h2>
            Big ideas start
            <br />
            with a single state.
          </h2>

          <p className="right-description">
            Turn automata theory into something you can see,
            <br className="desktop-break" />
            trace, and build—with confidence.
          </p>

          {/* DFA DIAGRAM */}
          <div className="automata-diagram">

            <svg
              viewBox="0 0 500 230"
              role="img"
              aria-label="DFA state transition diagram with states q0, q1 and q2"
            >
              <defs>
                <marker
                  id="dfa-arrow"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="5"
                  orient="auto"
                >
                  <path d="M0 0 L10 5 L0 10" fill="none" stroke="#050505" strokeWidth="1.5" />
                </marker>
              </defs>

              {/* Initial arrow */}
              <path
                d="M12 112 L53 112"
                className="dfa-line"
                markerEnd="url(#dfa-arrow)"
              />

              {/* q0 to q1 */}
              <path
                d="M112 112 L205 112"
                className="dfa-line"
                markerEnd="url(#dfa-arrow)"
              />

              <text x="157" y="97" className="dfa-label">0</text>

              {/* q1 to q2 */}
              <path
                d="M265 112 L355 112"
                className="dfa-line"
                markerEnd="url(#dfa-arrow)"
              />

              <text x="309" y="97" className="dfa-label">1</text>

              {/* q0 loop */}
              <path
                d="M77 83 C34 38 120 27 91 83"
                className="dfa-line"
                markerEnd="url(#dfa-arrow)"
              />

              <text x="78" y="34" className="dfa-label">1</text>

              {/* q1 loop */}
              <path
                d="M231 83 C188 38 274 27 245 83"
                className="dfa-line"
                markerEnd="url(#dfa-arrow)"
              />

              <text x="232" y="34" className="dfa-label">0</text>

              {/* q2 to q1 */}
              <path
                d="M390 143 C365 194 300 194 268 143"
                className="dfa-line"
                markerEnd="url(#dfa-arrow)"
              />

              <text x="322" y="180" className="dfa-label">0</text>

              {/* q2 to q0 */}
              <path
                d="M385 150 C340 232 105 232 78 151"
                className="dfa-line"
                markerEnd="url(#dfa-arrow)"
              />

              <text x="170" y="211" className="dfa-label">1</text>

              {/* State q0 */}
              <circle cx="82" cy="112" r="30" className="dfa-state" />
              <text x="82" y="118" className="dfa-state-text">q0</text>

              {/* State q1 */}
              <circle cx="235" cy="112" r="30" className="dfa-state" />
              <text x="235" y="118" className="dfa-state-text">q1</text>

              {/* Final state q2 */}
              <circle cx="385" cy="112" r="30" className="dfa-state" />
              <circle cx="385" cy="112" r="25" className="dfa-final-inner" />
              <text x="385" y="118" className="dfa-state-text">q2</text>

            </svg>

          </div>

          {/* THREE LEARNING STEPS */}
          <div className="learning-steps">

            <div className="learning-step">
              <span>01</span>
              <p>Explore a concept</p>
            </div>

            <div className="learning-step">
              <span>02</span>
              <p>Test your intuition</p>
            </div>

            <div className="learning-step">
              <span>03</span>
              <p>Build understanding</p>
            </div>

          </div>

          <div className="right-bottom-text">
            Built for Computer Science students. Designed for discovery.
          </div>

        </div>

      </section>

    </main>
  );
}

export default Register;