import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { readLearningProgress } from "../learningProgress";
import Icon from "./Icon";
import "../styles/Home.css";

const pageTitles = {
  "/": "Home",
  "/learn": "Learn",
  "/patterns": "Patterns",
  "/simulator": "Simulator",
  "/challenge": "Challenges",
  "/about": "About",
  "/settings": "Settings",
  "/notifications": "Notifications",
  "/gaming": "Gaming",
};

function WorkspaceTopbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState(readLearningProgress);
  const pageTitle = pageTitles[location.pathname] || "Workspace";

  useEffect(() => {
    const refreshProgress = () => setProgress(readLearningProgress());
    window.addEventListener("learning-progress-updated", refreshProgress);
    window.addEventListener("storage", refreshProgress);

    return () => {
      window.removeEventListener("learning-progress-updated", refreshProgress);
      window.removeEventListener("storage", refreshProgress);
    };
  }, []);

  return (
    <header className="home-topbar">
      <div className="home-breadcrumb">
        <span>Workspace</span>
        <span className="breadcrumb-divider">/</span>
        <strong>{pageTitle}</strong>
      </div>

      <div className="home-topbar-actions">
        <label className="home-search">
          <Icon name="search" size={15} />
          <input
            type="search"
            placeholder="Search concepts, patterns..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search concepts and patterns"
          />
          <kbd>⌘ K</kbd>
        </label>
        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
          title="Notifications"
          onClick={() => navigate("/notifications")}
        >
          <Icon name="bell" size={17} />
        </button>
        <span className="xp-pill">
          <span>✦</span> {progress.experiencePoints.toLocaleString()} XP
        </span>
      </div>
    </header>
  );
}

export default WorkspaceTopbar;
