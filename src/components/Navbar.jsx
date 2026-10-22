import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userName = localStorage.getItem("userName");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const firstLetter = userName
    ? userName.charAt(0).toUpperCase()
    : "";

  // Login ke bina protected page open nahi hoga
  const handleProtectedClick = (event, path) => {
    if (!isLoggedIn) {
      event.preventDefault();
      navigate("/login", {
        state: { from: { pathname: path } },
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("isLoggedIn");

    setIsProfileOpen(false);

    navigate("/");

    // Refresh navbar so Login appears again
    window.location.reload();
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="navbar-logo">
        <span className="logo-icon">⚡</span>

        <span>
          Automata Verse
        </span>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/learn"
          onClick={(event) =>
            handleProtectedClick(event, "/learn")
          }
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
        >
          Learn
        </NavLink>

        <NavLink
          to="/patterns"
          onClick={(event) =>
            handleProtectedClick(event, "/patterns")
          }
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
        >
          Patterns
        </NavLink>

        <NavLink
          to="/simulator"
          onClick={(event) =>
            handleProtectedClick(event, "/simulator")
          }
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
        >
          Simulator
        </NavLink>

        <NavLink
          to="/about"
          onClick={(event) =>
            handleProtectedClick(event, "/about")
          }
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
        >
          About
        </NavLink>

        {/* Login / Profile */}
        {!isLoggedIn ? (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Login
          </NavLink>
        ) : (
          <div className="profile-wrapper">

            {/* Profile Circle */}
            <button
              type="button"
              className="profile-avatar"
              onClick={() =>
                setIsProfileOpen(!isProfileOpen)
              }
              title={userName}
            >
              {firstLetter}
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="profile-dropdown">

                <div className="profile-info">

                  <div className="profile-avatar-large">
                    {firstLetter}
                  </div>

                  <div className="profile-name">
                    {userName}
                  </div>

                </div>

                <div className="profile-divider"></div>

                <button
                  type="button"
                  className="logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>
            )}

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;
