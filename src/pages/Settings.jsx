import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { resetLearningProgress } from "../learningProgress";
import "../styles/Settings.css";

const SETTINGS_KEY = "automataVerseSettings";
const BROWSER_NOTIFICATIONS_KEY = "automataVerseBrowserNotifications";
const EMAIL_REMINDER_PENDING_KEY = "automataVersePendingEmailReminder";
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://automata-verse-api-2026.onrender.com";
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

function getBrowserPermission() {
  return "Notification" in window ? window.Notification.permission : "unsupported";
}

async function saveEmailReminderPreference(enabled) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const response = await fetch(
    `${API_BASE_URL}/api/notifications/preferences`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dailyReminder: enabled, timezone }),
    }
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        "Email reminders need the updated backend to be deployed and SMTP configured."
      );
    }

    const error = new Error(
      data.error || "Could not save email reminder settings."
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

function Settings() {
  const navigate = useNavigate();
  const hasToken = Boolean(localStorage.getItem("token"));
  const [preferences, setPreferences] = useState(readPreferences);
  const [account, setAccount] = useState(readAccount);
  const [status, setStatus] = useState(
    () => (hasToken ? "" : "Sign in to manage email reminders.")
  );
  const [emailDeliveryAvailable, setEmailDeliveryAvailable] = useState(false);
  const [emailPreferencesLoaded, setEmailPreferencesLoaded] =
    useState(!hasToken);
  const [savingEmailPreference, setSavingEmailPreference] = useState(false);
  const [browserPermission, setBrowserPermission] = useState(getBrowserPermission);
  const [browserReminders, setBrowserReminders] = useState(
    () => localStorage.getItem(BROWSER_NOTIFICATIONS_KEY) === "true"
  );

  useEffect(() => {
    if (preferences.reduceMotion) {
      document.documentElement.dataset.reduceMotion = "true";
    } else {
      delete document.documentElement.dataset.reduceMotion;
    }
  }, [preferences.reduceMotion]);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");

    const loadEmailPreferences = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/notifications/preferences`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          ["userName", "isLoggedIn", "token", "authToken", "user"].forEach(
            (key) => localStorage.removeItem(key)
          );
          active = false;
          navigate("/login", {
            replace: true,
            state: { sessionExpired: true, from: { pathname: "/settings" } },
          });
          return;
        }

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              "Email reminders need the updated backend to be deployed and SMTP configured."
            );
          }

          throw new Error(
            data.error ||
              `Email reminders are unavailable on this server (HTTP ${response.status}).`
          );
        }

        if (!active) {
          return;
        }

        setEmailDeliveryAvailable(data.emailDeliveryAvailable === true);
        if (data.emailDeliveryAvailable !== true) {
          if (readPreferences().dailyReminder) {
            localStorage.setItem(EMAIL_REMINDER_PENDING_KEY, "true");
          }
          setStatus(
            "Email reminders are not configured on the server yet."
          );
        } else {
          const pendingPreference = localStorage.getItem(
            EMAIL_REMINDER_PENDING_KEY
          );

          if (pendingPreference === "true" || pendingPreference === "false") {
            const savedPreference = await saveEmailReminderPreference(
              pendingPreference === "true"
            );
            localStorage.removeItem(EMAIL_REMINDER_PENDING_KEY);
            const updated = {
              ...readPreferences(),
              dailyReminder: savedPreference.dailyReminder,
            };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
            setPreferences(updated);
          } else {
            const updated = {
              ...readPreferences(),
              dailyReminder: data.dailyReminder === true,
            };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
            setPreferences(updated);
          }
        }
      } catch (error) {
        console.error("Could not load email reminder preferences:", error);
        if (active) {
          if (readPreferences().dailyReminder) {
            localStorage.setItem(EMAIL_REMINDER_PENDING_KEY, "true");
          }
          setStatus(error.message);
        }
      } finally {
        if (active) {
          setEmailPreferencesLoaded(true);
        }
      }
    };

    if (token) {
      void loadEmailPreferences();
    }

    return () => {
      active = false;
    };
  }, [navigate]);

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

  const handleEmailReminderChange = async (enabled) => {
    const updated = { ...readPreferences(), dailyReminder: enabled };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    localStorage.setItem(EMAIL_REMINDER_PENDING_KEY, String(enabled));
    setPreferences(updated);

    if (!emailDeliveryAvailable) {
      setStatus(
        enabled
          ? "Reminder preference saved on this device. Email delivery will start after the backend and SMTP are configured."
          : "Email reminders are turned off. This preference will sync when the backend is available."
      );
      return;
    }

    setSavingEmailPreference(true);

    try {
      const data = await saveEmailReminderPreference(enabled);

      const savedPreferences = {
        ...readPreferences(),
        dailyReminder: data.dailyReminder,
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(savedPreferences));
      localStorage.removeItem(EMAIL_REMINDER_PENDING_KEY);
      setPreferences(savedPreferences);
      setEmailDeliveryAvailable(data.emailDeliveryAvailable === true);
      setStatus(
        data.dailyReminder
          ? `Daily lesson reminders will be emailed to ${account.email || "your account email"} at 9:00 AM local time.`
          : "Daily email reminders are turned off."
      );
    } catch (error) {
      console.error("Could not save email reminder preferences:", error);

      if (error.status === 401) {
        ["userName", "isLoggedIn", "token", "authToken", "user"].forEach(
          (key) => localStorage.removeItem(key)
        );
        navigate("/login", {
          replace: true,
          state: { sessionExpired: true, from: { pathname: "/settings" } },
        });
        return;
      }

      setStatus(
        `Preference saved on this device, but email delivery is pending: ${error.message}`
      );
    } finally {
      setSavingEmailPreference(false);
    }
  };

  const handleBrowserReminderClick = async () => {
    if (browserReminders) {
      localStorage.removeItem(BROWSER_NOTIFICATIONS_KEY);
      setBrowserReminders(false);
      setStatus("Browser reminders are turned off.");
      return;
    }

    if (!("Notification" in window)) {
      setBrowserPermission("unsupported");
      setStatus("This browser does not support notifications.");
      return;
    }

    if (window.Notification.permission === "denied") {
      setStatus(
        "Browser notifications are blocked. Allow them in your browser's site settings."
      );
      return;
    }

    try {
      const permission = await window.Notification.requestPermission();
      setBrowserPermission(permission);

      if (permission === "granted") {
        localStorage.setItem(BROWSER_NOTIFICATIONS_KEY, "true");
        setBrowserReminders(true);
        setStatus(
          "Browser reminders are allowed. They appear around 9:00 AM while AutomataVerse is open."
        );
      } else {
        setStatus("Browser reminders were not allowed.");
      }
    } catch (error) {
      console.error("Could not request browser notification permission:", error);
      setStatus("Could not request browser notification permission.");
    }
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
              <strong>Daily email lesson reminder</strong>
              <small>
                Email the lesson reminder to {account.email || "your login email"} at 9:00 AM local time.
              </small>
            </span>
            <input
              type="checkbox"
              checked={preferences.dailyReminder}
              disabled={savingEmailPreference}
              onChange={(event) =>
                handleEmailReminderChange(event.target.checked)
              }
            />
          </label>
          <div className="settings-browser-notification-row">
            <div>
              <strong>Browser notifications</strong>
              <small>
                The browser will ask whether to allow or block reminders. They appear while AutomataVerse is open.
              </small>
            </div>
            <button
              type="button"
              className="settings-browser-button"
              onClick={handleBrowserReminderClick}
            >
              {browserReminders
                ? "Turn off browser reminders"
                : browserPermission === "denied"
                  ? "Blocked in browser settings"
                  : browserPermission === "granted"
                    ? "Enable browser reminders"
                    : "Choose Allow or Don't allow"}
            </button>
          </div>
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
            {!emailPreferencesLoaded
              ? "Checking email reminder availability..."
              : emailDeliveryAvailable
                ? "Email delivery is configured. You can unsubscribe by turning off the daily reminder."
                      : preferences.dailyReminder
                        ? "Your reminder choice is saved on this device. Email delivery starts after the backend and SMTP are configured."
                        : "Email delivery needs to be configured by the app owner. Browser reminders can be enabled separately."}
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
