import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { resetLearningProgress } from "../learningProgress";
import "../styles/Settings.css";

const SETTINGS_KEY = "automataVerseSettings";
const defaultPreferences = {
  dailyReminder: false,
  weeklySummary: false,
  weeklyGoal: 3,
  reduceMotion: false,
};

function readPreferences() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (!saved) {
    return defaultPreferences;
  }

  const parsed = JSON.parse(saved);
  if (
    !parsed ||
    typeof parsed !== "object" ||
    typeof parsed.dailyReminder !== "boolean" ||
    typeof parsed.weeklySummary !== "boolean" ||
    !Number.isInteger(parsed.weeklyGoal) ||
    parsed.weeklyGoal < 1 ||
    parsed.weeklyGoal > 7 ||
    typeof parsed.reduceMotion !== "boolean"
  ) {
    throw new Error("Saved settings have an invalid format.");
  }

  return parsed;
}

function readAccount() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return {
    name: localStorage.getItem("userName") || user.name || "",
    email: user.email || localStorage.getItem("userEmail") || "",
  };
}

function Settings() {
  const [preferences, setPreferences] = useState(readPreferences);
  const [account, setAccount] = useState(readAccount);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (preferences.reduceMotion) {
      document.documentElement.dataset.reduceMotion = "true";
    } else {
      delete document.documentElement.dataset.reduceMotion;
    }
  }, [preferences.reduceMotion]);

  const updatePreferences = (changes) => {
    const updated = { ...preferences, ...changes };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    setPreferences(updated);
    setStatus("Settings saved.");
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    const name = account.name.trim();

    if (!name) {
      setStatus("Please enter a display name.");
      return;
    }

    localStorage.setItem("userName", name);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...user, name }));
    window.dispatchEvent(new Event("user-profile-updated"));
    setAccount({ ...account, name });
    setStatus("Display name updated on this device.");
  };

  const handleResetProgress = () => {
    const confirmed = window.confirm(
      "Reset all lesson, challenge, XP, streak, and learning-time progress? This cannot be undone."
    );
    if (!confirmed) {
      return;
    }

    resetLearningProgress();
    setStatus("Learning progress has been reset.");
  };

  return (
    <main className="settings-page">
      <div className="settings-content">
        <section className="settings-intro">
          <span>ACCOUNT PREFERENCES</span>
          <h2>Settings</h2>
          <p>Manage your profile, learning preferences, and saved data.</p>
        </section>

        <form className="settings-card" onSubmit={handleSaveProfile}>
          <div className="settings-card-heading">
            <span className="settings-icon"><Icon name="user" size={18} /></span>
            <div>
              <h3>Profile</h3>
              <p>Update how your name appears in AutomataVerse.</p>
            </div>
          </div>
          <div className="settings-fields">
            <label>
              Display name
              <input
                type="text"
                value={account.name}
                onChange={(event) =>
                  setAccount({ ...account, name: event.target.value })
                }
                maxLength={80}
                autoComplete="name"
              />
            </label>
            <label>
              Email address
              <input type="email" value={account.email} readOnly />
            </label>
          </div>
          <p className="settings-help">Your display name is saved in this browser.</p>
          <button type="submit" className="settings-primary-button">
            Save profile
          </button>
        </form>

        <section className="settings-card">
          <div className="settings-card-heading">
            <span className="settings-icon"><Icon name="clock" size={18} /></span>
            <div>
              <h3>Learning preferences</h3>
              <p>Set a weekly goal and choose motion preferences.</p>
            </div>
          </div>
          <div className="settings-preference-row">
            <label htmlFor="weekly-goal">Weekly learning goal</label>
            <div className="settings-goal-control">
              <select
                id="weekly-goal"
                value={preferences.weeklyGoal}
                onChange={(event) =>
                  updatePreferences({ weeklyGoal: Number(event.target.value) })
                }
              >
                {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                  <option key={days} value={days}>{days} days</option>
                ))}
              </select>
              <span>per week</span>
            </div>
          </div>
          <label className="settings-toggle-row">
            <span>
              <strong>Reduce motion</strong>
              <small>Limit decorative animations and transitions.</small>
            </span>
            <input
              type="checkbox"
              checked={preferences.reduceMotion}
              onChange={(event) =>
                updatePreferences({ reduceMotion: event.target.checked })
              }
            />
          </label>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <span className="settings-icon"><Icon name="bell" size={18} /></span>
            <div>
              <h3>Notifications</h3>
              <p>Choose which learning reminders you prefer.</p>
            </div>
          </div>
          <label className="settings-toggle-row">
            <span>
              <strong>Daily learning reminder</strong>
              <small>Save your preference for a daily study reminder.</small>
            </span>
            <input
              type="checkbox"
              checked={preferences.dailyReminder}
              onChange={(event) =>
                updatePreferences({ dailyReminder: event.target.checked })
              }
            />
          </label>
          <label className="settings-toggle-row">
            <span>
              <strong>Weekly progress summary</strong>
              <small>Save your preference for a weekly progress summary.</small>
            </span>
            <input
              type="checkbox"
              checked={preferences.weeklySummary}
              onChange={(event) =>
                updatePreferences({ weeklySummary: event.target.checked })
              }
            />
          </label>
          <p className="settings-help">
            Reminder delivery is not enabled yet; these preferences are saved on this device.
          </p>
        </section>

        <section className="settings-card settings-data-card">
          <div className="settings-card-heading">
            <span className="settings-icon"><Icon name="settings" size={18} /></span>
            <div>
              <h3>Learning data</h3>
              <p>Progress is stored locally in this browser.</p>
            </div>
          </div>
          <div className="settings-data-row">
            <span>
              <strong>Reset learning progress</strong>
              <small>Clear completed lessons, challenge results, XP, and streak history.</small>
            </span>
            <button
              type="button"
              className="settings-danger-button"
              onClick={handleResetProgress}
            >
              Reset progress
            </button>
          </div>
        </section>

        <p className="settings-status" role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </main>
  );
}

export default Settings;
