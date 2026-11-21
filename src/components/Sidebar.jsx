import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  getCurrentStreak,
  getCurrentWeekActivity,
  readLearningProgress,
} from "../learningProgress";
import Icon from "./Icon";
import "../styles/Home.css";

const navigationItems = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/learn", label: "Learn", icon: "learn", protected: true },
  { to: "/patterns", label: "Patterns", icon: "patterns", protected: true },
  { to: "/simulator", label: "Simulator", icon: "simulator", protected: true },
  { to: "/challenge", label: "Challenges", icon: "challenge", protected: true },
  { to: "/about", label: "About", icon: "about", protected: true },
];

function Sidebar() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(readLearningProgress);
  const [profileName, setProfileName] = useState(
    () => localStorage.getItem("userName") || "Alex Morgan"
  );
  const streak = getCurrentStreak(progress.activityDates);
  const weekActivity = getCurrentWeekActivity(progress.activityDates);

  useEffect(() => {
    const refreshProgress = () => setProgress(readLearningProgress());
    const refreshProfile = () =>
      setProfileName(localStorage.getItem("userName") || "Alex Morgan");
    window.addEventListener("learning-progress-updated", refreshProgress);
    window.addEventListener("storage", refreshProgress);
    window.addEventListener("user-profile-updated", refreshProfile);

    return () => {
      window.removeEventListener("learning-progress-updated", refreshProgress);
      window.removeEventListener("storage", refreshProgress);
      window.removeEventListener("user-profile-updated", refreshProfile);
    };
  }, []);

  const handleProtectedClick = (event, path) => {
    if (!localStorage.getItem("token")) {
      event.preventDefault();
      navigate("/login", { state: { from: { pathname: path } } });
    }
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out?")) {
      return;
    }

    localStorage.removeItem("userName");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="home-sidebar">
      <div className="home-brand">
        <span className="home-brand-icon">A</span>
        <span className="home-brand-copy">
          <strong>AutomataVerse</strong>
          <small>INTERACTIVE LEARNING</small>
        </span>
      </div>

      <div className="home-sidebar-label">WORKSPACE</div>
      <nav className="home-nav" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={(event) =>
              item.protected && handleProtectedClick(event, item.to)
            }
            className={({ isActive }) =>
              `home-nav-link${isActive ? " active" : ""}`
            }
          >
            <Icon name={item.icon} size={16} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <section className="sidebar-streak" aria-label={`${streak}-day streak`}>
        <strong>{streak}-day streak</strong>
        <p>A little progress, every day.</p>
        <div className="streak-days">
          {weekActivity.map(({ label, active }, index) => (
            <span
              key={`${label}-${index}`}
              className={active ? "complete" : ""}
            >
              <i />
              {label}
            </span>
          ))}
        </div>
      </section>

      <div className="sidebar-profile">
        <span className="sidebar-avatar">
          {profileName.charAt(0).toUpperCase()}
        </span>
        <span className="sidebar-profile-copy">
          <strong>{profileName}</strong>
          <small>Student · Free plan</small>
        </span>
      </div>

      <div className="sidebar-utility">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-utility-link${isActive ? " active" : ""}`
          }
        >
          <Icon name="settings" size={16} />
          <span>Settings</span>
        </NavLink>
        <button type="button" onClick={handleLogout}>
          <Icon name="logout" size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
