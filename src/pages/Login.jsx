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

  const handleLogin = (event) => {
    event.preventDefault();

    if (!name || !email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    // Save user's name for the navbar profile avatar
    localStorage.setItem("userName", name);

    // Save login status
    localStorage.setItem("isLoggedIn", "true");

    setMessage("Login successful!");

    setTimeout(() => {
      navigate("/");
    }, 800);
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

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <div className="password-wrapper">

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>
          </div>

          {/* Login Options */}
          <div className="login-options">

            <label className="remember-option">
              <input type="checkbox" />

              <span>
                Remember me
              </span>
            </label>

            <button
              type="button"
              className="forgot-password"
            >
              Forgot Password?
            </button>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-button"
          >
            Login →
          </button>

          {/* Message */}
          {message && (
            <p className="login-message">
              {message}
            </p>
          )}

        </form>

        {/* Register Section */}
        <div className="login-footer">

          <p>
            Don't have an account?

            <button
              type="button"
              className="register-text"
              onClick={() =>
                navigate("/register")
              }
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