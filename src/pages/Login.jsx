
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import "../styles/Login.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://automata-verse-api-2026.onrender.com";

function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!name.trim() || !email.trim() || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim() || undefined,
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage =
          data.error || data.message || "Invalid email or password.";

        setMessage(errorMessage);
        return;
      }

      if (
        typeof data.token !== "string" ||
        !data.token ||
        !data.user ||
        !data.user.name
      ) {
        setMessage("Invalid server response. Please try again.");
        return;
      }

      // Save login state after successful backend verification.
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");

      setMessage("Login successful!");

      navigate("/");
    } catch (error) {
      console.error("Login request failed:", error);
      setMessage(
        "Cannot connect to the server. Please try again in a moment."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="register-page login-page">
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
            <h1>Welcome back.</h1>
            <p>Your next state starts here.</p>
          </div>

          <form className="register-form login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-name">Full name</label>
              <input
                id="login-name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div className="password-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
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
            </div>

            <div className="login-options">
              <label className="remember-option">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  setMessage("Please contact support to reset your password.")
                }
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="register-button login-button"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in  →"}
            </button>

            {message && (
              <p className="register-message" role="status">
                {message}
              </p>
            )}
          </form>
        </div>

        <div className="register-footer">
          <span>Don't have an account?</span>
          <button
            type="button"
            className="login-link"
            onClick={() => navigate("/register")}
          >
            Create an account →
          </button>
        </div>
      </section>

      <section className="register-right">
        <div className="right-content">
          <div className="right-eyebrow">
            UNDERSTAND. EXPERIMENT. CREATE.
          </div>
          <h2>
            The next state
            <br />
            of learning.
          </h2>
          <p className="right-description">
            Turn automata theory into something you can see,
            <br className="desktop-break" />
            trace, and build—with confidence.
          </p>

          <div className="automata-diagram">
            <svg
              viewBox="0 0 500 230"
              role="img"
              aria-label="DFA state transition diagram with states q0, q1 and q2"
            >
              <defs>
                <marker
                  id="login-dfa-arrow"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="5"
                  orient="auto"
                >
                  <path
                    d="M0 0 L10 5 L0 10"
                    fill="none"
                    stroke="#050505"
                    strokeWidth="1.5"
                  />
                </marker>
              </defs>
              <path d="M12 112 L53 112" className="dfa-line" markerEnd="url(#login-dfa-arrow)" />
              <path d="M112 112 L205 112" className="dfa-line" markerEnd="url(#login-dfa-arrow)" />
              <text x="157" y="97" className="dfa-label">0</text>
              <path d="M265 112 L355 112" className="dfa-line" markerEnd="url(#login-dfa-arrow)" />
              <text x="309" y="97" className="dfa-label">1</text>
              <path d="M77 83 C34 38 120 27 91 83" className="dfa-line" markerEnd="url(#login-dfa-arrow)" />
              <text x="78" y="34" className="dfa-label">1</text>
              <path d="M231 83 C188 38 274 27 245 83" className="dfa-line" markerEnd="url(#login-dfa-arrow)" />
              <text x="232" y="34" className="dfa-label">0</text>
              <path d="M390 143 C365 194 300 194 268 143" className="dfa-line" markerEnd="url(#login-dfa-arrow)" />
              <text x="322" y="180" className="dfa-label">0</text>
              <path d="M385 150 C340 232 105 232 78 151" className="dfa-line" markerEnd="url(#login-dfa-arrow)" />
              <text x="170" y="211" className="dfa-label">1</text>
              <circle cx="82" cy="112" r="30" className="dfa-state" />
              <text x="82" y="118" className="dfa-state-text">q0</text>
              <circle cx="235" cy="112" r="30" className="dfa-state" />
              <text x="235" y="118" className="dfa-state-text">q1</text>
              <circle cx="385" cy="112" r="30" className="dfa-state" />
              <circle cx="385" cy="112" r="25" className="dfa-final-inner" />
              <text x="385" y="118" className="dfa-state-text">q2</text>
            </svg>
          </div>

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

export default Login;
