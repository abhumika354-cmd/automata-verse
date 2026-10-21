import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

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

    // Clear old login data before checking credentials.
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");

    try {
      setIsLoading(true);

      const response = await fetch(
        "https://automata-verse-api-2026.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      // Never log in when the backend rejects the credentials.
      if (!response.ok) {
        setMessage(
          data.error || data.message || "Invalid name, email or password."
        );
        return;
      }

      // A successful response must contain both a token and user.
      if (
        typeof data.token !== "string" ||
        !data.token ||
        !data.user ||
        !data.user.name
      ) {
        setMessage("Invalid server response. Please try again.");
        return;
      }

      // Save login state only after backend verification succeeds.
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userName", data.user.name);
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
    <main className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-icon">⚡</div>
          <h1>Welcome Back</h1>
          <p>
            Login to continue your Automata learning journey.
          </p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-wrapper">
              <input
                id="password"
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
                setMessage(
                  "Please contact support to reset your password."
                )
              }
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Checking..." : "Login →"}
          </button>

          {message && (
            <p className="login-message" role="status">
              {message}
            </p>
          )}
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              className="register-text"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;