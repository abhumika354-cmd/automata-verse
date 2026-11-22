import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import WorkspaceLayout from "./components/WorkspaceLayout";
import { recordLearningSeconds } from "./learningProgress";

import Home from "./pages/Home";
import Gaming from "./pages/Gaming";
import Patterns from "./pages/Patterns";
import Simulator from "./pages/Simulator";
import Learn from "./pages/Learn";
import About from "./pages/About";
import Challenge from "./pages/Challenge";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const BROWSER_NOTIFICATIONS_KEY = "automataVerseBrowserNotifications";
const BROWSER_NOTIFICATION_TIMESTAMP_KEY =
  "automataVerseBrowserReminderTimestamp";
const BROWSER_REMINDER_COOLDOWN_MS = 30 * 60 * 1000;

// Login protection
function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    if (!("Notification" in window)) {
      return undefined;
    }

    const showBrowserReminder = async () => {
      if (
        localStorage.getItem(BROWSER_NOTIFICATIONS_KEY) !== "true" ||
        window.Notification.permission !== "granted"
      ) {
        return;
      }

      const now = Date.now();
      const lastReminder = Number(
        localStorage.getItem(BROWSER_NOTIFICATION_TIMESTAMP_KEY) || 0
      );

      if (now - lastReminder < BROWSER_REMINDER_COOLDOWN_MS) {
        return;
      }

      try {
        const options = {
          body: "Continue your learning journey whenever you're ready.",
          icon: "/favicon.svg",
        };

        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification(
            "Your AutomataVerse lesson is waiting for you",
            options
          );
        } else {
          new window.Notification(
            "Your AutomataVerse lesson is waiting for you",
            options
          );
        }
        localStorage.setItem(
          BROWSER_NOTIFICATION_TIMESTAMP_KEY,
          String(now)
        );
      } catch (error) {
        console.error("Could not show browser learning reminder:", error);
      }
    };

    showBrowserReminder();
    const intervalId = window.setInterval(
      showBrowserReminder,
      BROWSER_REMINDER_COOLDOWN_MS
    );

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const learningPaths = ["/learn", "/patterns", "/simulator", "/challenge"];

    if (!learningPaths.includes(location.pathname)) {
      return undefined;
    }

    let active = document.visibilityState === "visible";
    let lastTick = Date.now();
    let accumulatedSeconds = 0;

    const trackTime = () => {
      const now = Date.now();

      if (active) {
        accumulatedSeconds += (now - lastTick) / 1000;
      }

      lastTick = now;

      if (accumulatedSeconds >= 15) {
        const elapsed = Math.floor(accumulatedSeconds);
        accumulatedSeconds -= elapsed;
        recordLearningSeconds(elapsed);
      }
    };

    const handleVisibilityChange = () => {
      trackTime();
      active = document.visibilityState === "visible";
      lastTick = Date.now();
    };

    const intervalId = window.setInterval(trackTime, 15000);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      trackTime();
      window.clearInterval(intervalId);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [location.pathname]);

  return (
    <>
      {location.pathname !== "/register" &&
        location.pathname !== "/login" &&
        location.pathname !== "/learn" &&
        location.pathname !== "/patterns" &&
        location.pathname !== "/simulator" &&
        location.pathname !== "/challenge" &&
        location.pathname !== "/about" &&
        location.pathname !== "/settings" &&
        location.pathname !== "/notifications" &&
        location.pathname !== "/gaming" &&
        location.pathname !== "/" && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/gaming"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Gaming />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/patterns"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Patterns />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/simulator"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Simulator />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/learn"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Learn />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <About />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Settings />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <WorkspaceLayout>
              <Notifications />
            </WorkspaceLayout>
          }
        />

        <Route
          path="/challenge"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Challenge />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
